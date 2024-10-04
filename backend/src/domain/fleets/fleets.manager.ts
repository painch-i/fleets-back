import { Inject, Injectable, Logger } from '@nestjs/common';
import { MAX_FLEET_MEMBERS } from '../../config/config-variables';
import { FLEETS_DELAYS, FLEETS_SHORT_DELAYS } from '../../config/delays';
import { EventStore } from '../../infrastructure/events/event-store.service';
import { FeatureFlagsService } from '../../infrastructure/feature-flags/feature-flags.service';
import { FirebaseService } from '../../infrastructure/firebase.service';
import { FleetsRepository } from '../../infrastructure/repositories/fleets.repository';
import { FleetsUnitOfWork } from '../../infrastructure/repositories/fleets.unit-of-work';
import { UsersRepository } from '../../infrastructure/repositories/users.repository';
import { RoutesService } from '../../infrastructure/routes/routes.service';
import { LocalTaskSchedulerService } from '../../infrastructure/scheduler/local-task-scheduler.service';
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
  NotEnoughMembersInFleet as NotEnoughMembersInFleetError,
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
  private readonly logger = new Logger(FleetsManager.name);

  constructor(
    @Inject(FleetsRepository)
    private readonly fleetsRepository: IFleetsRepository,
    @Inject(UsersRepository)
    private readonly usersRepository: IUsersRepository,
    @Inject(FleetsUnitOfWork)
    private readonly unitOfWork: IFleetsUnitOfWork,
    @Inject(EventGateway)
    private readonly eventGateway: IEventGateway,
    @Inject(LocalTaskSchedulerService)
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
    this.logger.log(
      `Start creating fleet with administrator ID: ${options.administratorId}`,
    );

    try {
      // Fetching fleet delays
      this.logger.verbose('Fetching fleet delays...');
      const fleetsDelays = await this.getFleetsDelays();
      this.logger.debug(
        `Fleet delays fetched: ${JSON.stringify(fleetsDelays)}`,
      );

      // Validating the create fleet options
      this.logger.verbose('Validating create fleet options...');
      const validationSchema = getCreateFleetOptionsSchema({
        minDepartureDelay: fleetsDelays.MIN_DEPARTURE_MINUTES_DELAY,
        minGatheringDelay: fleetsDelays.MIN_GATHERING_DELAY,
        maxGatheringDelay: fleetsDelays.MAX_GATHERING_DELAY,
      });
      validationSchema.parse(options);
      this.logger.debug('Create fleet options validation successful.');

      // Validating route hash
      this.logger.verbose(`Validating route hash: ${options.route.hash}`);
      const isHashValid = await this.routesService.validateHash(
        options.route.hash,
        options.route.linesTaken,
      );
      if (!isHashValid) {
        this.logger.error(
          `Invalid route hash for route: ${options.route.hash}`,
        );
        throw new ValidationError('Invalid route hash', [
          {
            code: 'invalid-hash',
            path: ['route', 'hash'],
          },
        ]);
      }
      this.logger.debug('Route hash validation successful.');

      // Fetching the administrator user
      this.logger.verbose('Fetching administrator user...');
      const administrator = await this.usersRepository.getUserById({
        id: options.administratorId,
        includePending: false,
      });
      this.logger.debug(
        `Administrator user fetched: ${JSON.stringify(administrator)}`,
      );

      if (administrator.fleetId) {
        this.logger.warn(
          `Administrator with ID ${administrator.id} already has a fleet: ${administrator.fleetId}`,
        );
        throw new UserAlreadyHasAFleetError();
      }

      // Creating the fleet
      this.logger.verbose('Creating fleet...');
      const fleet = new Fleet();
      fleet.create(options);
      fleet.network = administrator.network;
      this.logger.log(`Fleet created with ID: ${fleet.id}`);

      // Setting gender constraint
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
      this.logger.debug(`Gender constraint set: ${genderConstraint}`);

      // Persisting the fleet
      this.logger.verbose(`Persisting fleet with ID: ${fleet.id}`);
      await this.fleetsRepository.persist(fleet);
      this.logger.log(`Fleet persisted successfully with ID: ${fleet.id}`);

      // Storing event in the event store
      this.logger.verbose('Storing fleet creation event...');
      await this.eventStore.store({
        aggregateId: fleet.id,
        aggregateType: 'fleet',
        createdAt: new Date(),
        eventType: 'fleet-created',
        payload: {
          fleetId: fleet.id,
        },
      });
      this.logger.debug('Fleet creation event stored successfully.');

      // Adding administrator to the fleet room
      this.logger.verbose(
        `Joining administrator ${administrator.id} to fleet room ${fleet.id}`,
      );
      this.eventGateway.joinFleetRoom(fleet.id, administrator.id);

      // Scheduling tasks
      this.logger.verbose(
        `Scheduling departure task for fleet ID: ${fleet.id}`,
      );
      this.scheduleDepartureTask(fleet.id, fleet.departureTime);

      this.logger.verbose(
        `Scheduling gathering task for fleet ID: ${fleet.id}`,
      );
      this.scheduleGatheringTask(fleet.id, fleet.gatheringTime);

      this.logger.log(
        `Fleet creation completed successfully for fleet ID: ${fleet.id}`,
      );
      return fleet;
    } catch (error) {
      this.logger.error(
        `Failed to create fleet: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async startFleetGathering(fleetId: Id) {
    this.logger.log(
      `Starting fleet gathering process for fleet ID: ${fleetId}`,
    );

    try {
      // Validate fleetId schema
      this.logger.verbose('Validating fleet ID...');
      fleetId = entityIdSchema.parse(fleetId);
      this.logger.debug(`Fleet ID validated: ${fleetId}`);

      // Fetch fleet details with memberships and users
      this.logger.verbose(`Fetching fleet details for fleet ID: ${fleetId}`);
      const fleet = await this.fleetsRepository.findById(
        { fleetId },
        {
          memberships: {
            include: {
              user: true,
            },
          },
        },
      );
      this.logger.debug(`Fetched fleet details: ${JSON.stringify(fleet)}`);

      // Check if gathering has already started
      if (fleet.hasGatheringStarted()) {
        this.logger.warn(`Gathering already started for fleet ID: ${fleetId}`);
        throw new FleetGatheringAlreadyStartedError();
      }

      // Check if there are enough members in the fleet
      if (fleet.members && fleet.members.length === 1) {
        this.logger.warn(
          `Not enough members in fleet ID: ${fleetId}, canceling fleet.`,
        );
        await this.cancelFleet(fleetId);
        throw new NotEnoughMembersInFleetError();
      }

      // Start gathering process
      this.logger.verbose(`Starting gathering for fleet ID: ${fleetId}`);
      fleet.startGathering();

      // Update fleet status in the database
      this.logger.verbose(
        `Updating fleet status in database for fleet ID: ${fleetId}`,
      );
      await this.fleetsRepository.update(fleetId, {
        status: FleetStatusToDatabase[fleet.status],
      });
      this.logger.log(
        `Fleet status updated successfully for fleet ID: ${fleetId}`,
      );

      // Clear join requests
      this.logger.verbose(`Clearing join requests for fleet ID: ${fleetId}`);
      await this.fleetsRepository.clearJoinRequests({ fleetId });
      this.logger.log(`Join requests cleared for fleet ID: ${fleetId}`);

      // Store event in the event store
      this.logger.verbose(
        `Storing fleet gathering started event for fleet ID: ${fleetId}`,
      );
      await this.eventStore.store({
        aggregateId: fleetId,
        aggregateType: 'fleet',
        createdAt: new Date(),
        eventType: 'fleet-gathering-started',
        payload: {
          fleetId,
        },
      });
      this.logger.debug('Fleet gathering started event stored successfully');

      // Broadcast event to fleet members
      this.logger.verbose(
        `Broadcasting fleet gathering started event to fleet ID: ${fleetId}`,
      );
      this.eventGateway.broadcastToFleet(fleetId, {
        type: 'fleet-gathering-started',
        payload: {
          fleetId,
        },
      });
      this.logger.log(
        `Fleet gathering event broadcasted successfully for fleet ID: ${fleetId}`,
      );

      // Send notifications to fleet members
      if (fleet.members) {
        this.logger.verbose('Sending notifications to fleet members...');
        const notificationTokens: string[] = [];
        for (const member of fleet.members) {
          if (member.notificationToken) {
            notificationTokens.push(member.notificationToken);
          }
        }
        if (notificationTokens.length > 0) {
          this.notificationsService.sendNotification({
            token: notificationTokens,
            title: fleet.name,
            message: 'Le rassemblement a commencé !',
            data: {
              type: 'fleet-gathering-started',
              fleetId,
            },
          });
          this.logger.log(
            `Notifications sent to ${notificationTokens.length} members of fleet ID: ${fleetId}`,
          );
        } else {
          this.logger.warn(
            `No notification tokens found for fleet ID: ${fleetId}`,
          );
        }
      }
    } catch (error) {
      this.logger.error(
        `Failed to start gathering for fleet ID: ${fleetId}`,
        error.stack,
      );
      throw error;
    }
  }

  async startFleetTrip(fleetId: Id) {
    this.logger.log(`Starting trip for fleet ID: ${fleetId}`);

    try {
      // Validate fleetId schema
      this.logger.verbose('Validating fleet ID...');
      fleetId = entityIdSchema.parse(fleetId);
      this.logger.debug(`Fleet ID validated: ${fleetId}`);

      // Fetch fleet details with memberships and users
      this.logger.verbose(`Fetching fleet details for fleet ID: ${fleetId}`);
      const fleet = await this.fleetsRepository.findById(
        { fleetId },
        {
          memberships: {
            include: {
              user: true,
            },
          },
        },
      );
      this.logger.debug(`Fetched fleet details: ${JSON.stringify(fleet)}`);

      // Check if the trip has already started
      if (fleet.hasTripStarted()) {
        this.logger.warn(`Trip already started for fleet ID: ${fleetId}`);
        throw new FleetTripAlreadyStartedError();
      }

      // Kick absent members
      this.logger.verbose(`Kicking absent members from fleet ID: ${fleetId}`);
      await this.kickAbsentMembers(fleet);

      // Check if there are enough members in the fleet
      if (fleet.members && fleet.members.length < 2) {
        this.logger.warn(
          `Not enough members in fleet ID: ${fleetId}, canceling fleet.`,
        );
        await this.cancelFleet(fleetId);
        throw new NotEnoughMembersInFleetError();
      }

      // Start the trip
      this.logger.verbose(`Starting trip for fleet ID: ${fleetId}`);
      fleet.startTrip();

      // Update fleet status in the database
      this.logger.verbose(
        `Updating fleet status in database for fleet ID: ${fleetId}`,
      );
      await this.fleetsRepository.update(fleetId, {
        status: FleetStatusToDatabase[fleet.status],
      });
      this.logger.log(
        `Fleet status updated successfully for fleet ID: ${fleetId}`,
      );

      // Store trip-start event in the event store
      this.logger.verbose(`Storing trip-start event for fleet ID: ${fleetId}`);
      await this.eventStore.store({
        aggregateId: fleetId,
        aggregateType: 'fleet',
        createdAt: new Date(),
        eventType: 'fleet-trip-started',
        payload: {
          fleetId,
        },
      });
      this.logger.debug('Fleet trip-start event stored successfully.');

      // Broadcast trip-start event to fleet members
      this.logger.verbose(
        `Broadcasting trip-start event to fleet ID: ${fleetId}`,
      );
      this.eventGateway.broadcastToFleet(fleetId, {
        type: 'fleet-trip-started',
        payload: {
          fleetId,
        },
      });
      this.logger.log(
        `Fleet trip-start event broadcasted successfully for fleet ID: ${fleetId}`,
      );

      // Send notifications to fleet members
      if (fleet.members) {
        this.logger.verbose('Sending notifications to fleet members...');
        const notificationTokens: string[] = [];
        for (const member of fleet.members) {
          if (member.notificationToken) {
            notificationTokens.push(member.notificationToken);
          }
        }
        if (notificationTokens.length > 0) {
          this.notificationsService.sendNotification({
            token: notificationTokens,
            title: fleet.name,
            message: 'Le trajet a commencé !',
            data: {
              type: 'fleet-trip-started',
              fleetId,
            },
          });
          this.logger.log(
            `Notifications sent to ${notificationTokens.length} members of fleet ID: ${fleetId}`,
          );
        } else {
          this.logger.warn(
            `No notification tokens found for fleet ID: ${fleetId}`,
          );
        }
      }
    } catch (error) {
      this.logger.error(
        `Failed to start trip for fleet ID: ${fleetId}`,
        error.stack,
      );
      throw error;
    }
  }

  private async cancelFleet(fleetId: Id) {
    this.logger.log(`Canceling fleet with ID: ${fleetId}`);

    try {
      const fleet = await this.fleetsRepository.findById({ fleetId });
      fleet.status = FleetStatus.CANCELLED;
      this.logger.debug(
        `Fetched fleet for cancellation: ${JSON.stringify(fleet)}`,
      );

      await this.fleetsRepository.update(fleetId, {
        status: FleetStatusToDatabase[fleet.status],
      });
      this.logger.log(
        `Fleet status updated to 'canceled' for fleet ID: ${fleetId}`,
      );

      await this.eventStore.store({
        aggregateId: fleetId,
        aggregateType: 'fleet',
        createdAt: new Date(),
        eventType: 'fleet-canceled',
        payload: { fleetId },
      });
      this.logger.log(`Fleet-canceled event stored for fleet ID: ${fleetId}`);

      this.eventGateway.broadcastToFleet(fleetId, {
        type: 'fleet-canceled',
        payload: { fleetId },
      });
      this.logger.log(`Broadcast fleet-canceled event to fleet ID: ${fleetId}`);

      await this.taskScheduler.unScheduleTasks(fleetId);
      this.logger.log(`Unscheduled all tasks for fleet ID: ${fleetId}`);
    } catch (error) {
      this.logger.error(`Failed to cancel fleet ID: ${fleetId}`, error.stack);
      throw error;
    }
  }

  private async kickAbsentMembers(fleet: Fleet) {
    this.logger.log(`Kicking absent members from fleet ID: ${fleet.id}`);

    const members = fleet.members;
    if (!members) {
      this.logger.error('Fleet members not loaded');
      throw new Error('Fleet members not loaded');
    }

    return Promise.all(
      members.map((member) => {
        if (!member.hasConfirmedHisPresence) {
          this.logger.log(
            `Kicking absent member with ID: ${member.id} from fleet ID: ${fleet.id}`,
          );
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
    this.logger.log(`Fetching fleet with options: ${JSON.stringify(options)}`);
    options = getFleetOptionsSchema.parse(options);
    let userId: Id | undefined;
    let includeEndedFleets = true;

    if (options.userId) {
      userId = options.userId;
      includeEndedFleets = false;
    }

    try {
      const fleet = await this.fleetsRepository.findById(
        {
          fleetId: options.fleetId,
          memberId: userId,
          includeEnded: includeEndedFleets,
        },
        {
          memberships: { include: { user: true } },
          startStation: true,
          endStation: true,
        },
      );

      if (!fleet) {
        this.logger.warn(`No fleet found`);
        return null;
      }

      this.logger.log(`Successfully fetched fleet for fleet ID: ${fleet.id}`);
      return fleet;
    } catch (error) {
      this.logger.error(
        `Failed to fetch fleet with options: ${JSON.stringify(options)}`,
        error.stack,
      );
      throw error;
    }
  }

  async searchFleets(options: SearchFleetsOptions) {
    this.logger.log(
      `Searching fleets with options: ${JSON.stringify(options)}`,
    );

    const fleetsDelays = await this.getFleetsDelays();
    const validationSchema = getSearchFleetsOptionsSchema({
      minFormationDelay: fleetsDelays.MIN_FORMATION_DELAY,
    });
    options = validationSchema.parse(options);

    try {
      const searcher = await this.usersRepository.getUserById({
        id: options.searcherId,
        includePending: false,
      });
      this.logger.debug(`Searcher details: ${JSON.stringify(searcher)}`);

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

      const fleets = await this.fleetsRepository.findAll({
        startStationId: options.startStationId,
        endStationId: options.endStationId,
        departureTime,
        genderConstraints,
        status: FleetStatus.FORMATION,
        network,
      });

      this.logger.log(
        `Found ${fleets.length} fleets matching search criteria.`,
      );
      return fleets;
    } catch (error) {
      this.logger.error(
        `Failed to search fleets with options: ${JSON.stringify(options)}`,
        error.stack,
      );
      throw error;
    }
  }

  async requestToJoinFleet(options: CreateJoinRequestOptions) {
    this.logger.debug(
      `Received request to join fleet with options: ${JSON.stringify(options)}`,
    );
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

    if (!fleet) {
      this.logger.error(
        `Fleet with ID ${options.fleetId} not found or in invalid state.`,
      );
      throw new Error('Fleet not found or not in FORMATION state');
    }

    await this.unitOfWork.withTransaction(async (fleetsRepository) => {
      this.logger.debug(
        `Transaction started for user ${options.userId} to join fleet ${options.fleetId}`,
      );

      if (!fleet.members) {
        this.logger.error('Fleet members not loaded');
        throw new Error('Fleet members not loaded');
      }

      const userInFleet = fleet.members.some(
        (member) => member.id === options.userId,
      );
      if (userInFleet) {
        this.logger.warn(
          `User ${options.userId} already part of fleet ${options.fleetId}`,
        );
        throw new UserAlreadyHasAFleetError();
      }

      const user = await this.usersRepository.getUserById({
        id: options.userId,
        includePending: false,
      });
      if (!isUserMeetingConstraints(fleet.genderConstraint, user.gender)) {
        this.logger.warn(
          `User ${options.userId} does not meet gender constraints for fleet ${options.fleetId}`,
        );
        throw new UserNotMeetingConstraintsError();
      }

      if (fleet.members.length >= MAX_FLEET_MEMBERS) {
        this.logger.warn(`Fleet ${options.fleetId} is full`);
        throw new FleetIsFullError();
      }

      try {
        await fleetsRepository.persistJoinRequest(joinRequest);
        this.logger.log(
          `Join request created for user ${options.userId} to join fleet ${options.fleetId}`,
        );
      } catch (error) {
        if (error.code === 'P2002') {
          this.logger.error(
            `User ${options.userId} has already requested to join fleet ${options.fleetId}`,
          );
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
      payload: { joinRequestId: joinRequest.id },
    });

    this.eventGateway.broadcastToUser(fleet.administratorId, {
      type: 'join-request-received',
      payload: { userId: options.userId },
    });

    if (fleet.administrator?.notificationToken) {
      this.notificationsService.sendNotification({
        token: fleet.administrator.notificationToken,
        title: fleet.name,
        message: 'Un utilisateur a demandé à rejoindre votre Fleet !',
        data: { type: 'join-request-received', userId: options.userId },
      });
    }

    this.logger.debug(
      `Join request process completed for user ${options.userId} and fleet ${options.fleetId}`,
    );
    return joinRequest;
  }

  async respondToFleetRequest(options: RespondToRequestOptions) {
    this.logger.debug(
      `Received response to fleet join request with options: ${JSON.stringify(options)}`,
    );
    options = respondToRequestOptionsSchema.parse(options);

    await this.unitOfWork.withTransaction(async (fleetsRepository) => {
      const joinRequest = await fleetsRepository.findJoinRequest({
        fleetId: options.fleetId,
        userId: options.userId,
        administratorId: options.administratorId,
      });

      if (joinRequest.status !== JoinRequestStatus.PENDING) {
        this.logger.warn(
          `Join request for user ${options.userId} already handled`,
        );
        throw new JoinRequestAlreadyHandledError();
      }

      if (!options.accepted) {
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
          payload: { joinRequestId: joinRequest.id },
        });

        this.eventGateway.broadcastToUser(options.userId, {
          type: 'join-request-refused',
          payload: { fleetId: options.fleetId },
        });

        this.logger.log(
          `Join request rejected for user ${options.userId} and fleet ${options.fleetId}`,
        );
        return joinRequest;
      }

      const [fleet, user] = await Promise.all([
        fleetsRepository.findById(
          { fleetId: options.fleetId, status: FleetStatus.FORMATION },
          { memberships: { include: { user: true } } },
        ) as Promise<Fleet>,
        this.usersRepository.getUserById({
          id: options.userId,
          includePending: false,
        }),
      ]);

      if (user.fleetId) {
        this.logger.warn(`User ${options.userId} already has a fleet`);
        throw new UserAlreadyHasAFleetError();
      }

      if (!fleet.members) {
        this.logger.error('Fleet members not loaded');
        throw new Error('Fleet members not loaded');
      }

      if (fleet.members.length >= MAX_FLEET_MEMBERS) {
        this.logger.warn(`Fleet ${options.fleetId} is full`);
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
        payload: { joinRequestId: joinRequest.id },
      });

      this.eventGateway.broadcastToUser(options.userId, {
        type: 'join-request-accepted',
        payload: { fleetId: options.fleetId },
      });
      this.eventGateway.broadcastToFleet(options.fleetId, {
        type: 'member-joined',
        payload: { fleetId: options.fleetId, userId: options.userId },
      });
      this.eventGateway.joinFleetRoom(options.fleetId, options.userId);

      this.logger.log(
        `Join request accepted for user ${options.userId} and fleet ${options.fleetId}`,
      );
    });
  }

  async scheduleDepartureTask(fleetId: Id, departureTime: Date) {
    const taskId = `departure-${fleetId}`;
    return this.taskScheduler.scheduleTask({
      taskId,
      task: async () => {
        await this.startFleetTrip(fleetId);
      },
      time: departureTime,
    });
  }
  async scheduleGatheringTask(fleetId: Id, gatheringTime: Date) {
    const taskId = `gathering-${fleetId}`;
    return this.taskScheduler.scheduleTask({
      taskId,
      task: async () => {
        await this.startFleetGathering(fleetId);
      },
      time: gatheringTime,
    });
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
      const fleet = await fleetsRepository.findById(
        {
          fleetId,
          administratorId,
        },
        {
          memberships: {
            include: {
              user: true,
            },
          },
        },
      );

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
        this.notificationsService.sendNotification({
          token: notificationTokens,
          title: fleet.name,
          message: 'Le Fleet est terminé !',
          data: {
            type: 'fleet-ended',
            fleetId,
          },
        });
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
    this.notificationsService.sendNotification({
      token: presentMemberTokens,
      title: fleet.name,
      message: 'Un membre a confirmé sa présence au rassemblement !',
      data: {
        type: 'presence-confirmed',
        fleetId,
        memberId,
      },
    });
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

    await this.eventStore.store({
      aggregateId: fleetId,
      aggregateType: 'fleet',
      createdAt: new Date(),
      eventType: 'member-removed',
      payload: {
        fleetId,
        memberId,
      },
    });

    // Envoyer un événement pour informer les utilisateurs
    this.eventGateway.broadcastToFleet(fleetId, {
      type: 'member-removed',
      payload: {
        fleetId,
        memberId,
      },
    });

    // Faire quitter la room du Fleet
    this.eventGateway.leaveFleetRoom(fleetId, memberId);
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
