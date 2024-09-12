import { Inject, Injectable } from '@nestjs/common';
import { MAX_FLEET_MEMBERS } from '../../config/config-variables';
import { FLEETS_DELAYS, FLEETS_SHORT_DELAYS } from '../../config/delays';
import { EventStore } from '../../infrastructure/events/event-store.service';
import { FeatureFlagsService } from '../../infrastructure/feature-flags/feature-flags.service';
import { FirebaseService } from '../../infrastructure/firebase.service';
import { FleetsRepository } from '../../infrastructure/repositories/fleets.repository';
import { FleetsUnitOfWork } from '../../infrastructure/repositories/fleets.unit-of-work';
import { UsersRepository } from '../../infrastructure/repositories/users.repository';
import { RoutesService } from '../../infrastructure/routes/routes.service';
import { EventBridgeTaskScheduler } from '../../infrastructure/scheduler/event-bridge-task-scheduler.service';
import { EventGateway } from '../../presenter/event/event.gateway';
import { Id } from '../../types';
import { isUserMeetingConstraints } from '../../utils';
import { ValidationError } from '../_shared/errors/validation.error';
import { IEventGateway } from '../_shared/event-gateway.interface';
import { IEventStore } from '../_shared/event-store.interface';
import { IFeatureFlagsService } from '../_shared/feature-flags-service.interface';
import { INotificationsService } from '../_shared/notifications-service.interface';
import { IRoutesService } from '../navigation/routes-service.interface';
import { GenderEnum, UserNetwork } from '../users/entities/user.types';
import { IUsersRepository } from '../users/interfaces/users-repository.interface';
import { Fleet } from './entities/fleet.entity';
import { JoinRequest } from './entities/join-request.entity';
import {
  FleetAlreadyFinishedError,
  FleetGatheringAlreadyStartedError,
  FleetIsFullError,
  FleetTripAlreadyStartedError,
  JoinRequestAlreadyHandledError,
  NotEnoughMembersInFleet,
  UserAlreadyHasAFleetError,
  UserAlreadyRequestedToJoinFleetError,
  UserNotMeetingConstraintsError,
} from './errors/errors';
import {
  CreateFleetOptions,
  CreateJoinRequestOptions,
  FindByAdminOptions,
  FindByMemberAndAdminOptions,
  FleetStatus,
  FleetStatusToDatabase,
  GenderConstraintCreationConfigEnum,
  GenderConstraintEnum,
  GetFleetOptions,
  JoinRequestStatus,
  ListJoinRequestOptions,
  RespondToRequestOptions,
  SearchFleetsOptions,
} from './fleets.types';
import { IFleetsRepository } from './interfaces/fleets-repository.interface';
import { IFleetsUnitOfWork } from './interfaces/fleets-unit-of-work.interface';
import { ITaskScheduler } from './interfaces/task-scheduler.interface';
import { getCreateFleetOptionsSchema } from './validation-schemas/create-fleet-options.schema';
import { createJoinRequestOptionsSchema } from './validation-schemas/create-join-request-options.schema';
import { entityIdSchema } from './validation-schemas/entity-id.schema';
import { findByAdminOptionsSchema } from './validation-schemas/find-by-admin-options.schema';
import { findByMemberAndAdminOptionsSchema } from './validation-schemas/find-by-member-options.schema';
import { getFleetOptionsSchema } from './validation-schemas/get-fleet-options.schema';
import { listJoinRequestOptionsSchema } from './validation-schemas/list-join-request-options.schema';
import { respondToRequestOptionsSchema } from './validation-schemas/respond-to-request-options.schema';
import { getSearchFleetsOptionsSchema } from './validation-schemas/search-fleets-options.schema';

@Injectable()
export class FleetsManager {
  constructor(
    @Inject(FleetsRepository)
    private readonly fleetsRepository: IFleetsRepository,
    @Inject(UsersRepository)
    private readonly usersRepository: IUsersRepository,
    @Inject(FleetsUnitOfWork)
    private readonly unitOfWork: IFleetsUnitOfWork,
    @Inject(EventGateway)
    private readonly eventGateway: IEventGateway,
    @Inject(EventBridgeTaskScheduler)
    private readonly taskScheduler: ITaskScheduler,
    @Inject(EventStore)
    private readonly eventStore: IEventStore,
    @Inject(FeatureFlagsService)
    private readonly featureFlagsService: IFeatureFlagsService,
    @Inject(RoutesService)
    private readonly routesService: IRoutesService,
    @Inject(FirebaseService)
    private readonly notificationsService: INotificationsService,
  ) {}
  async createFleet(options: CreateFleetOptions) {
    const fleetsDelays = await this.getFleetsDelays();
    const validationSchema = getCreateFleetOptionsSchema({
      minDepartureDelay: fleetsDelays.MIN_DEPARTURE_MINUTES_DELAY,
      minGatheringDelay: fleetsDelays.MIN_GATHERING_DELAY,
      maxGatheringDelay: fleetsDelays.MAX_GATHERING_DELAY,
    });
    validationSchema.parse(options);
    const isHashValid = await this.routesService.validateHash(
      options.route.hash,
      options.route.linesTaken,
    );
    if (!isHashValid) {
      throw new ValidationError('Invalid route hash', [
        {
          code: 'invalid-hash',
          path: ['route', 'hash'],
        },
      ]);
    }
    const administrator = await this.usersRepository.getUserById({
      id: options.administratorId,
      includePending: false,
    });
    if (administrator.fleetId) {
      throw new UserAlreadyHasAFleetError();
    }
    const fleet = new Fleet();
    fleet.create(options);
    fleet.network = administrator.network;
    let genderConstraint = GenderConstraintEnum.NO_CONSTRAINT;
    if (
      options.genderConstraintConfig ===
      GenderConstraintCreationConfigEnum.USER_GENDER_ONLY
    ) {
      switch (administrator.gender) {
        case GenderEnum.FEMALE:
          genderConstraint = GenderConstraintEnum.FEMALE_ONLY;
          break;
        case GenderEnum.MALE:
          genderConstraint = GenderConstraintEnum.MALE_ONLY;
          break;
      }
    }
    fleet.setGenderConstraint(genderConstraint);
    await this.fleetsRepository.persist(fleet);
    await this.eventStore.store({
      aggregateId: fleet.id,
      aggregateType: 'fleet',
      createdAt: new Date(),
      eventType: 'fleet-created',
      payload: {
        fleetId: fleet.id,
      },
    });
    this.eventGateway.joinFleetRoom(fleet.id, administrator.id);
    this.scheduleDepartureTask(fleet.id, fleet.departureTime);
    this.scheduleGatheringTask(fleet.id, fleet.gatheringTime);
    return fleet;
  }

  async startFleetGathering(fleetId: Id) {
    fleetId = entityIdSchema.parse(fleetId);
    const fleet = await this.fleetsRepository.findById(
      {
        fleetId,
      },
      {
        memberships: {
          include: {
            user: true,
          },
        },
      },
    );
    // Vérifier si le rassemblement est déjà en cours
    if (fleet.hasGatheringStarted()) {
      throw new FleetGatheringAlreadyStartedError();
    }

    if (fleet.members && fleet.members.length === 1) {
      throw new NotEnoughMembersInFleet();
    }

    fleet.startGathering();
    // Mettre à jour le statut du Fleet dans la base de données
    await this.fleetsRepository.update(fleetId, {
      status: FleetStatusToDatabase[fleet.status],
    });
    await this.fleetsRepository.clearJoinRequests({
      fleetId,
    });
    // Committer les changements dans la base de données d'événements
    await this.eventStore.store({
      aggregateId: fleetId,
      aggregateType: 'fleet',
      createdAt: new Date(),
      eventType: 'fleet-gathering-started',
      payload: {
        fleetId,
      },
    });
    // Envoyer un événement pour informer les utilisateurs
    this.eventGateway.broadcastToFleet(fleetId, {
      type: 'fleet-gathering-started',
      payload: {
        fleetId,
      },
    });
    // Envoer une notification à tous les membres du Fleet
    if (fleet.members) {
      const notificationTokens: string[] = [];
      for (const member of fleet.members) {
        if (member.notificationToken) {
          notificationTokens.push(member.notificationToken);
        }
      }
      this.notificationsService.sendNotification(
        notificationTokens,
        'Le rassemblement a commencé !',
      );
    }
    // Supprimer la tâche planifiée pour le rassemblement
    await this.taskScheduler.deleteScheduledTask({
      type: 'start-gathering',
      fleetId,
    });
  }

  async startFleetTrip(fleetId: Id) {
    fleetId = entityIdSchema.parse(fleetId);
    const fleet = await this.fleetsRepository.findById(
      {
        fleetId,
      },
      {
        memberships: {
          include: {
            user: true,
          },
        },
      },
    );

    // Vérifier si le voyage a déjà commencé
    if (fleet.hasTripStarted()) {
      throw new FleetTripAlreadyStartedError();
    }

    await this.kickAbsentMembers(fleet);
    if (fleet.members && fleet.members.length === 1) {
      await this.cancelFleet(fleetId);
      throw new NotEnoughMembersInFleet();
    }

    // Mettre à jour l'état du Fleet pour indiquer que le voyage a commencé
    fleet.startTrip();

    // Mettre à jour le statut du Fleet dans la base de données
    await this.fleetsRepository.update(fleetId, {
      status: FleetStatusToDatabase[fleet.status],
    });

    // Committer les changements dans la base de données d'événements
    await this.eventStore.store({
      aggregateId: fleetId,
      aggregateType: 'fleet',
      createdAt: new Date(),
      eventType: 'fleet-trip-started',
      payload: {
        fleetId,
      },
    });

    // Envoyer un événement pour informer les utilisateurs
    this.eventGateway.broadcastToFleet(fleetId, {
      type: 'fleet-trip-started',
      payload: {
        fleetId,
      },
    });

    // Envoer une notification à tous les membres du Fleet
    if (fleet.members) {
      const notificationTokens: string[] = [];
      for (const member of fleet.members) {
        if (member.notificationToken) {
          notificationTokens.push(member.notificationToken);
        }
      }
      this.notificationsService.sendNotification(
        notificationTokens,
        'Le voyage a commencé !',
      );
    }

    // Supprimer la tâche planifiée pour le départ
    await this.taskScheduler.deleteScheduledTask({
      type: 'start-trip',
      fleetId,
    });
  }

  private async cancelFleet(fleetId: Id) {
    const fleet = await this.fleetsRepository.findById({
      fleetId,
    });
    await this.fleetsRepository.update(fleetId, {
      status: FleetStatusToDatabase[fleet.status],
    });
    await this.eventStore.store({
      aggregateId: fleetId,
      aggregateType: 'fleet',
      createdAt: new Date(),
      eventType: 'fleet-canceled',
      payload: {
        fleetId,
      },
    });
    this.eventGateway.broadcastToFleet(fleetId, {
      type: 'fleet-canceled',
      payload: {
        fleetId,
      },
    });
  }

  private async kickAbsentMembers(fleet: Fleet) {
    const members = fleet.members;
    if (!members) {
      throw new Error('Fleet members not loaded');
    }
    return Promise.all(
      members.map((member) => {
        if (!member.hasConfirmedHisPresence) {
          return this.removeFleetMember({
            fleetId: member.fleetId,
            administratorId: fleet.administratorId,
            memberId: member.id,
          });
        }
      }),
    );
  }

  async getFleet(options: GetFleetOptions) {
    options = getFleetOptionsSchema.parse(options);
    let userId: Id | undefined;
    let includeEndedFleets = true;
    if (options.userId) {
      userId = options.userId;
      includeEndedFleets = false;
    }
    const fleet = await this.fleetsRepository.findById(
      {
        fleetId: options.fleetId,
        memberId: userId,
        includeEnded: includeEndedFleets,
      },
      {
        memberships: {
          include: {
            user: true,
          },
        },
        startStation: true,
        endStation: true,
      },
    );
    if (!fleet) {
      return null;
    }
    return fleet;
  }

  async searchFleets(options: SearchFleetsOptions) {
    const fleetsDelays = await this.getFleetsDelays();
    const validationSchema = getSearchFleetsOptionsSchema({
      minFormationDelay: fleetsDelays.MIN_FORMATION_DELAY,
    });
    options = validationSchema.parse(options);
    const searcher = await this.usersRepository.getUserById({
      id: options.searcherId,
      includePending: false,
    });
    const genderConstraints = [GenderConstraintEnum.NO_CONSTRAINT];
    switch (searcher.gender) {
      case GenderEnum.MALE:
        genderConstraints.push(GenderConstraintEnum.MALE_ONLY);
        break;
      case GenderEnum.FEMALE:
        genderConstraints.push(GenderConstraintEnum.FEMALE_ONLY);
        break;
    }
    const departureTime = new Date(options.departureTime);
    let network: UserNetwork | undefined;
    if (searcher.network) {
      network = searcher.network;
    }
    return this.fleetsRepository.findAll({
      startStationId: options.startStationId,
      endStationId: options.endStationId,
      departureTime,
      genderConstraints,
      status: FleetStatus.FORMATION,
      network,
    });
  }

  async requestToJoinFleet(options: CreateJoinRequestOptions) {
    options = createJoinRequestOptionsSchema.parse(options);
    const joinRequest = new JoinRequest();
    joinRequest.create(options);
    const fleet = await this.fleetsRepository.findById(
      {
        fleetId: options.fleetId,
        status: FleetStatus.FORMATION,
      },
      {
        administrator: true,
        memberships: {
          include: {
            user: true,
          },
        },
      },
    );
    // Une transaction sert à s'assurer que toutes les opérations sont effectuées
    // ou aucune. Si une opération échoue, toutes les opérations sont annulées.
    // https://www.prisma.io/docs/concepts/components/prisma-client/transactions
    // Par exemple, si entre temps, un autre utilisateur a rejoint le Fleet,
    // et que le Fleet est plein, la transaction échouera et l'erreur sera catchée.
    await this.unitOfWork.withTransaction(async (fleetsRepository) => {
      // 1. Check if user already has a fleet
      if (!fleet.members) {
        throw new Error('Fleet members not loaded');
      }
      const userInFleet = fleet.members.some(
        (member) => member.id === options.userId,
      );
      if (userInFleet) {
        throw new UserAlreadyHasAFleetError();
      }

      const user = await this.usersRepository.getUserById({
        id: options.userId,
        includePending: false,
      });
      // 2. Check if user meets gender requirements
      if (!isUserMeetingConstraints(fleet.genderConstraint, user.gender)) {
        throw new UserNotMeetingConstraintsError();
      }
      // 3. Check if fleet is full
      if (fleet.members.length >= MAX_FLEET_MEMBERS) {
        throw new FleetIsFullError();
      }
      try {
        await fleetsRepository.persistJoinRequest(joinRequest);
      } catch (error) {
        if (error.code === 'P2002') {
          throw new UserAlreadyRequestedToJoinFleetError();
        }
        throw error;
      }
    });
    await this.eventStore.store({
      aggregateId: joinRequest.id,
      aggregateType: 'join-request',
      createdAt: new Date(),
      eventType: 'join-request-created',
      payload: {
        joinRequestId: joinRequest.id,
      },
    });
    this.eventGateway.broadcastToUser(fleet.administratorId, {
      type: 'join-request-received',
      payload: {
        userId: options.userId,
      },
    });
    if (fleet.administrator?.notificationToken) {
      this.notificationsService.sendNotification(
        fleet.administrator.notificationToken,
        `Un utilisateur a demandé à rejoindre votre covoiturage`,
      );
    }
    return joinRequest;
  }

  async respondToFleetRequest(options: RespondToRequestOptions) {
    options = respondToRequestOptionsSchema.parse(options);
    await this.unitOfWork.withTransaction(async (fleetsRepository) => {
      const joinRequest = await fleetsRepository.findJoinRequest({
        fleetId: options.fleetId,
        userId: options.userId,
        administratorId: options.administratorId,
      });
      if (joinRequest.status !== JoinRequestStatus.PENDING) {
        throw new JoinRequestAlreadyHandledError();
      }
      if (options.accepted === false) {
        joinRequest.reject();
        await fleetsRepository.updateJoinRequestStatus({
          findOptions: {
            fleetId: options.fleetId,
            userId: options.userId,
            administratorId: options.administratorId,
          },
          status: JoinRequestStatus.REJECTED,
        });
        await this.eventStore.store({
          aggregateId: joinRequest.id,
          aggregateType: 'join-request',
          createdAt: new Date(),
          eventType: 'join-request-refused',
          payload: {
            joinRequestId: joinRequest.id,
          },
        });
        return joinRequest;
      }
      const [fleet, user] = await Promise.all([
        fleetsRepository.findById(
          {
            fleetId: options.fleetId,
            status: FleetStatus.FORMATION,
          },
          {
            memberships: {
              include: {
                user: true,
              },
            },
          },
        ) as Promise<Fleet>,
        this.usersRepository.getUserById({
          id: options.userId,
          includePending: false,
        }),
      ]);
      if (user.fleetId) {
        joinRequest.reject();
        await fleetsRepository.updateJoinRequestStatus({
          findOptions: {
            fleetId: options.fleetId,
            userId: options.userId,
            administratorId: options.administratorId,
          },
          status: JoinRequestStatus.REJECTED,
        });
        await this.eventStore.store({
          aggregateId: joinRequest.id,
          aggregateType: 'join-request',
          createdAt: new Date(),
          eventType: 'join-request-refused',
          payload: {
            joinRequestId: joinRequest.id,
          },
        });
        throw new UserAlreadyHasAFleetError();
      }
      if (!fleet.members) {
        throw new Error('Fleet members not loaded');
      }
      if (fleet.members.length >= MAX_FLEET_MEMBERS) {
        joinRequest.reject();
        await fleetsRepository.updateJoinRequestStatus({
          findOptions: {
            fleetId: options.fleetId,
            userId: options.userId,
            administratorId: options.administratorId,
          },
          status: JoinRequestStatus.REJECTED,
        });
        await this.eventStore.store({
          aggregateId: joinRequest.id,
          aggregateType: 'join-request',
          createdAt: new Date(),
          eventType: 'join-request-refused',
          payload: {
            joinRequestId: joinRequest.id,
          },
        });
        throw new FleetIsFullError();
      }
      joinRequest.accept();
      await fleetsRepository.updateJoinRequestStatus({
        findOptions: {
          fleetId: options.fleetId,
          userId: options.userId,
          administratorId: options.administratorId,
        },
        status: JoinRequestStatus.ACCEPTED,
      });
      await fleetsRepository.clearOtherJoinRequests({
        fleetId: options.fleetId,
        userId: options.userId,
        administratorId: options.administratorId,
      });
      await fleetsRepository.addFleetMembers({
        fleetId: options.fleetId,
        userIds: [options.userId],
      });
      await this.eventStore.store({
        aggregateId: joinRequest.id,
        aggregateType: 'join-request',
        createdAt: new Date(),
        eventType: 'join-request-accepted',
        payload: {
          joinRequestId: joinRequest.id,
        },
      });
      if (options.accepted === true) {
        const notificationTokens: string[] = [];
        if (fleet.members) {
          for (const member of fleet.members) {
            if (member.notificationToken) {
              notificationTokens.push(member.notificationToken);
            }
          }
        }
        this.eventGateway.broadcastToUser(user.id, {
          type: 'join-request-accepted',
          payload: {
            fleetId: options.fleetId,
          },
        });
        this.eventGateway.broadcastToFleet(options.fleetId, {
          type: 'user-joined-fleet',
          payload: {
            userId: user.id,
          },
        });
        this.notificationsService.sendNotification(
          notificationTokens,
          'Un utilisateur a rejoint le Fleet !',
        );
        this.eventGateway.joinFleetRoom(options.fleetId, user.id);
        if (user.notificationToken) {
          this.notificationsService.sendNotification(
            user.notificationToken,
            `Vous avez été accepté dans un Fleet !`,
          );
        }
      } else {
        this.eventGateway.broadcastToUser(user.id, {
          type: 'join-request-rejected',
          payload: {
            fleetId: options.fleetId,
          },
        });
        if (user.notificationToken) {
          this.notificationsService.sendNotification(
            user.notificationToken,
            `Votre demande a été refusée`,
          );
        }
      }
    });
  }
  async scheduleDepartureTask(fleetId: Id, departureTime: Date) {
    return this.taskScheduler.scheduleDeparture(fleetId, departureTime);
  }
  async scheduleGatheringTask(fleetId: Id, gatheringTime: Date) {
    return this.taskScheduler.scheduleGathering(fleetId, gatheringTime);
  }

  async listJoinRequests(options: ListJoinRequestOptions) {
    options = listJoinRequestOptionsSchema.parse(options);
    return this.fleetsRepository.listJoinRequests(
      {
        fleetId: options.fleetId,
        userId: options.userId,
        administratorId: options.administratorId,
      },
      {
        user: true,
      },
    );
  }

  async endFleet(options: FindByAdminOptions) {
    options = findByAdminOptionsSchema.parse(options);
    const { fleetId, administratorId } = options;
    await this.unitOfWork.withTransaction(async (fleetsRepository) => {
      const fleet = await fleetsRepository.findById({
        fleetId,
        administratorId,
      });

      // Vérifier si le fleet a déjà été terminé
      if (fleet.status === FleetStatus.ARRIVED) {
        throw new FleetAlreadyFinishedError();
      }

      // Marquer le fleet comme terminé
      fleet.end();

      // Mettre à jour le statut du fleet dans la base de données
      await fleetsRepository.endFleet({
        fleetId,
        administratorId,
      });

      // Committer les changements dans la base de données d'événements
      await this.eventStore.store({
        aggregateId: fleetId,
        aggregateType: 'fleet',
        createdAt: new Date(),
        eventType: 'fleet-ended',
        payload: {
          fleetId,
        },
      });

      // Envoyer un événement pour informer les utilisateurs
      this.eventGateway.broadcastToFleet(fleetId, {
        type: 'fleet-ended',
        payload: {
          fleetId,
        },
      });

      // Envoer une notification à tous les membres du fleet
      if (fleet.members) {
        const notificationTokens: string[] = [];
        for (const member of fleet.members) {
          if (member.notificationToken) {
            notificationTokens.push(member.notificationToken);
          }
        }
        this.notificationsService.sendNotification(
          notificationTokens,
          'Le Fleet est terminé !',
        );
      }
    });
  }

  async confirmPresenceAtGathering(options: FindByMemberAndAdminOptions) {
    options = findByMemberAndAdminOptionsSchema.parse(options);
    const { fleetId, memberId } = options;
    await this.fleetsRepository.updateMember(
      {
        fleetId,
        memberId,
        fleetStatus: FleetStatus.GATHERING,
      },
      {
        hasConfirmedHisPresence: true,
      },
    );
    this.eventGateway.broadcastToUser(memberId, {
      type: 'presence-confirmed',
      payload: { fleetId, memberId },
    });

    const fleet = await this.fleetsRepository.findById(
      {
        fleetId,
      },
      {
        memberships: {
          include: {
            user: true,
          },
        },
      },
    );
    const presentMemberTokens: string[] = [];
    if (fleet.members) {
      for (const member of fleet.members) {
        if (
          member.notificationToken &&
          member.hasConfirmedHisPresence &&
          member.id !== memberId
        ) {
          presentMemberTokens.push(member.notificationToken);
        }
      }
    }
    this.eventGateway.broadcastToUser(memberId, {
      type: 'presence-confirmed',
      payload: { fleetId, memberId },
    });
    this.notificationsService.sendNotification(
      presentMemberTokens,
      'Un membre a confirmé sa présence au rassemblement !',
    );
  }

  async removeFleetMember(options: FindByMemberAndAdminOptions) {
    options = findByMemberAndAdminOptionsSchema.parse(options);
    const { fleetId, administratorId, memberId, status } = options;

    await this.fleetsRepository.removeFleetMember({
      fleetId,
      memberId,
      administratorId,
      status,
    });

    // Committer les changements dans la base de données d'événements
    // fleet.commit();

    // Faire quitter la room du Fleet
    this.eventGateway.leaveFleetRoom(fleetId, memberId);

    // Envoyer un événement pour informer les utilisateurs
    this.eventGateway.broadcastToFleet(fleetId, {
      type: 'member-removed',
      payload: {
        fleetId,
        memberId,
      },
    });
  }

  private async getFleetsDelays() {
    const useShortDelays =
      this.featureFlagsService.isEnabled('use-short-delays');
    if (useShortDelays) {
      return FLEETS_SHORT_DELAYS;
    } else {
      return FLEETS_DELAYS;
    }
  }
}
