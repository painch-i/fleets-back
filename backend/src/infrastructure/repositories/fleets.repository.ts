/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Fleet, FleetId } from 'src/domain/fleets/entities/fleet.entity';
import { RepositoryErrors } from '../../domain/_shared/repository.interface';
import { JoinRequest } from '../../domain/fleets/entities/join-request.entity';
import {
  FindByAdminOptions,
  FindByIdOptions,
  FindByMemberAndAdminOptions,
  FindJoinRequestOptions,
  FleetStatus,
  FleetStatusToDatabase,
  JoinRequestStatusToDatabase,
} from '../../domain/fleets/fleets.types';
import {
  AddMembersOptions,
  FindAllOptions,
  FindMemberOptions,
  FindUniqueJoinRequestOptions,
  IFleetsRepository,
  UpdateJoinRequestStatusOptions,
} from '../../domain/fleets/interfaces/fleets-repository.interface';
import { UserNetworkEnumToDatabase } from '../../domain/users/entities/user.types';
import { Id } from '../../types';
import { PrismaService } from '../persistence/read-database/prisma/prisma.service';

@Injectable()
export class FleetsRepository implements IFleetsRepository {
  constructor(private prisma: PrismaService) {}
  async endFleet(options: FindByAdminOptions): Promise<void> {
    await this.prisma.fleet.update({
      where: {
        id: options.fleetId,
        administratorId: options.administratorId,
      },
      data: {
        status: FleetStatusToDatabase[FleetStatus.ARRIVED],
      },
    });
  }

  async listJoinRequests(
    options: FindJoinRequestOptions,
    include?: Prisma.JoinRequestInclude,
  ): Promise<JoinRequest[]> {
    const where: Prisma.JoinRequestWhereInput = {
      fleetId: options.fleetId,
    };
    if (options.userId) {
      where.userId = options.userId;
    }
    if (options.administratorId) {
      where.fleet = {
        administratorId: options.administratorId,
      };
    }
    const joinRequests = await this.prisma.joinRequest.findMany({
      where,
      include,
    });
    return joinRequests.map(JoinRequest.fromDatabase);
  }
  async addFleetMembers(options: AddMembersOptions): Promise<void> {
    await this.prisma.fleet.update({
      where: {
        id: options.fleetId,
      },
      data: {
        memberships: {
          create: options.userIds.map((userId) => ({
            userId,
            hasConfirmedHisPresence: false,
          })),
        },
      },
    });
  }
  async updateJoinRequestStatus({
    findOptions,
    status,
  }: UpdateJoinRequestStatusOptions): Promise<void> {
    const where: Prisma.JoinRequestWhereUniqueInput = {
      fleetId_userId: {
        fleetId: findOptions.fleetId,
        userId: findOptions.userId,
      },
    };
    if (findOptions.administratorId) {
      where.fleet = {
        administratorId: findOptions.administratorId,
      };
    }
    await this.prisma.joinRequest.update({
      where,
      data: {
        status: JoinRequestStatusToDatabase[status],
      },
    });
  }
  async findCurrentFleetByUserId(userId: Id): Promise<Fleet> {
    const foundFleetData = await this.prisma.fleet.findFirst({
      where: {
        memberships: {
          some: {
            userId,
          },
        },
      },
      include: {
        administrator: true,
        memberships: {
          include: {
            fleet: true,
          },
        },
      },
    });
    if (!foundFleetData) {
      throw new RepositoryErrors.EntityNotFoundError(Fleet, userId);
    }
    return Fleet.fromDatabase(foundFleetData);
  }
  async clearOtherJoinRequests({
    fleetId,
    userId,
    administratorId,
  }: FindJoinRequestOptions): Promise<void> {
    const where: Prisma.JoinRequestWhereInput = {
      fleetId: fleetId,
    };
    if (userId) {
      where.userId = {
        not: userId,
      };
    }
    if (administratorId) {
      where.fleet = {
        administratorId: administratorId,
      };
    }
    await this.prisma.joinRequest.deleteMany({
      where,
    });
  }
  async findJoinRequest({
    fleetId,
    userId,
    administratorId,
  }: FindUniqueJoinRequestOptions): Promise<JoinRequest> {
    const where: Prisma.JoinRequestWhereUniqueInput = {
      fleetId_userId: {
        fleetId,
        userId,
      },
    };
    if (administratorId) {
      where.fleet = {
        administratorId,
      };
    }
    const joinRequest = await this.prisma.joinRequest.findUnique({
      where,
    });
    if (!joinRequest) {
      throw new RepositoryErrors.EntityNotFoundError(JoinRequest, fleetId);
    }
    return JoinRequest.fromDatabase(joinRequest);
  }

  async clearJoinRequests(options: FindJoinRequestOptions): Promise<void> {
    const where: Prisma.JoinRequestWhereInput = {
      fleetId: options.fleetId,
    };
    if (options.userId) {
      where.userId = options.userId;
    }
    if (options.administratorId) {
      where.fleet = {
        administratorId: options.administratorId,
      };
    }
    await this.prisma.joinRequest.deleteMany({
      where,
    });
  }

  async findById(
    findOptions: FindByIdOptions,
    include?: Prisma.FleetInclude,
  ): Promise<Fleet> {
    if (!findOptions.fleetId && !findOptions.memberId) {
      throw new Error('Either fleetId or userId must be provided');
    }
    let where: Prisma.FleetWhereInput = {};

    let id: Id | undefined;
    if (findOptions.fleetId) {
      id = findOptions.fleetId;
      where = {
        id: findOptions.fleetId,
      };
    }
    if (findOptions.memberId) {
      id = findOptions.memberId;
      where = {
        memberships: {
          some: {
            userId: findOptions.memberId,
          },
        },
      };
    }

    if (findOptions.administratorId) {
      where = {
        ...where,
        administratorId: findOptions.administratorId,
      };
    }

    if (findOptions.includeEnded === false) {
      where = {
        ...where,
        status: {
          not: FleetStatusToDatabase[FleetStatus.ARRIVED, FleetStatus.CANCELLED],
        },
      };
    }

    const foundFleetData = await this.prisma.fleet.findFirst({
      where,
      include,
    });
    if (!foundFleetData) {
      throw new RepositoryErrors.EntityNotFoundError(
        Fleet,
        id ? id : 'unknown',
      );
    }
    return Fleet.fromDatabase(foundFleetData);
  }
  transaction<T>(
    work: (repository: IFleetsRepository) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(async (prisma) => {
      return await work(new FleetsRepository(prisma as any));
    });
  }
  async persistJoinRequest(joinRequest: JoinRequest): Promise<JoinRequest> {
    const joinRequestData = await this.prisma.joinRequest.create({
      data: {
        status: JoinRequestStatusToDatabase[joinRequest.status],
        id: joinRequest.id,
        user: {
          connect: {
            id: joinRequest.userId,
          },
        },
        fleet: {
          connect: {
            id: joinRequest.fleetId,
          },
        },
      },
    });
    return JoinRequest.fromDatabase(joinRequestData);
  }
  async findAll(options?: FindAllOptions): Promise<Fleet[]> {
    const findOptions: Prisma.FleetFindManyArgs = {};
    if (options) {
      findOptions.where = {
        startStation: {
          id: options.startStationId,
        },
        endStation: {
          id: options.endStationId,
        },
        departureTime: {
          gte: options.departureTime,
        },
        genderConstraint: {
          in: options.genderConstraints.map((constraint) => constraint),
        },
        status: FleetStatusToDatabase[options.status],
        network: options.network ? UserNetworkEnumToDatabase[options.network] : undefined,
      };
    }
    const Fleets = await this.prisma.fleet.findMany(findOptions);
    return Fleets.map(Fleet.fromDatabase);
  }
  // async addFleetMembers(entity: Fleet): Promise<void> {
  //   await this.prisma.fleet.update({
  //     where: { id: entity.id },
  //     data: {
  //       users: {
  //         connect: entity.members.map((member) => ({
  //           id: member.id,
  //         })),
  //       },
  //     },
  //   });
  // }
  async persist(entity: Fleet): Promise<void> {
    const memberships: Prisma.UserMembershipUncheckedCreateNestedManyWithoutFleetInput =
      {};
    memberships.create = [
      {
        userId: entity.administratorId,
        hasConfirmedHisPresence: false,
      },
    ];

    try {
      await this.prisma.fleet.create({
        data: {
          id: entity.id,
          name: entity.name,
          memberships,
          administrator: {
            connect: {
              id: entity.administratorId,
            },
          },
          endStation: {
            connect: {
              id: entity.endStationId,
            },
          },
          startStation: {
            connect: {
              id: entity.startStationId,
            },
          },
          departureTime: entity.departureTime,
          gatheringTime: entity.gatheringTime,
          genderConstraint: entity.genderConstraint,
          isJoinable: entity.isJoinable,
          status: FleetStatusToDatabase[entity.status],
          linesTaken: entity.linesTaken,
          network: entity.network
            ? UserNetworkEnumToDatabase[entity.network]
            : undefined,
        },
      });
    } catch (error) {
      console.error(error);
      if (error.code === 'P2025') {
        throw new StationOrLineNotFoundError();
      }
      throw error;
    }
  }
  async update(
    id: FleetId,
    updateInput: Prisma.FleetUpdateInput,
  ): Promise<void> {
    await this.prisma.fleet.update({
      where: {
        id,
      },
      data: updateInput,
    });
  }

  async delete(options: FindByAdminOptions): Promise<void> {
    await this.prisma.fleet.delete({
      where: {
        id: options.fleetId,
        administratorId: options.administratorId,
      },
    });
  }

  async updateMember(findOptions: FindMemberOptions, updateInput: Prisma.UserMembershipUpdateInput): Promise<void> {
    const fleetWhere: Prisma.FleetWhereInput = {};
    if (findOptions.fleetStatus) {
      fleetWhere.status = FleetStatusToDatabase[findOptions.fleetStatus];
    }
    try {
      await this.prisma.userMembership.update({
        where: {
          userId_fleetId: {
            userId: findOptions.memberId,
            fleetId: findOptions.fleetId,
          },
          fleet: fleetWhere,
        },
        data: updateInput,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new RepositoryErrors.RepositoryError('Unable to update member');
      }
      throw error;
    }
  }

  async removeFleetMember(options: FindByMemberAndAdminOptions) {
    const fleetWhere: Prisma.FleetWhereInput = {};
    if (options.status) {
      fleetWhere.status = FleetStatusToDatabase[options.status];
    }
    await this.prisma.userMembership.delete({
      where: {
        userId_fleetId: {
          userId: options.memberId,
          fleetId: options.fleetId,
        },
        fleet: fleetWhere,
      },
    });
  }
}

export class StationOrLineNotFoundError extends Error {
  constructor() {
    super('Station or Line not found');
  }
}
