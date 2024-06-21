import { Prisma } from '@prisma/client';
import { UserId } from '../../users/entities/user.types';
import { Fleet, FleetId } from '../entities/fleet.entity';
import { JoinRequest } from '../entities/join-request.entity';
import {
  FindByAdminOptions,
  FindByIdOptions,
  FindByMemberAndAdminOptions,
  FindJoinRequestOptions,
  FleetStatus,
  GenderConstraintEnum,
  JoinRequestStatus,
} from '../fleets.types';

export type FindAllOptions = {
  endStationId: string;
  startStationId: string;
  departureTime: Date;
  genderConstraints: GenderConstraintEnum[];
  status: FleetStatus;
};

export type UpdateJoinRequestStatusOptions = {
  findOptions: FindUniqueJoinRequestOptions;
  status: JoinRequestStatus;
};

export type AddMembersOptions = {
  fleetId: FleetId;
  userIds: UserId[];
};

export type FindUniqueJoinRequestOptions = {
  userId: UserId;
  fleetId: FleetId;
  administratorId?: UserId;
};

export type FindMemberOptions = {
  memberId: UserId;
  fleetId: FleetId;
  fleetStatus?: FleetStatus;
};

export interface IFleetsRepository {
  endFleet(options: FindByAdminOptions): Promise<void>;
  persist(entity: Fleet): Promise<void>;
  findById(
    findOptions: FindByIdOptions,
    include?: Prisma.FleetInclude,
  ): Promise<Fleet>;
  findAll(options?: FindAllOptions): Promise<Fleet[]>;
  persistJoinRequest(joinRequest: JoinRequest): Promise<JoinRequest>;
  clearOtherJoinRequests(options: FindJoinRequestOptions): Promise<void>;
  findJoinRequest(options: FindJoinRequestOptions): Promise<JoinRequest>;
  findCurrentFleetByUserId(userId: UserId): Promise<Fleet>;
  updateJoinRequestStatus(
    options: UpdateJoinRequestStatusOptions,
  ): Promise<void>;
  addFleetMembers(options: AddMembersOptions): Promise<void>;
  removeFleetMember(options: FindByMemberAndAdminOptions): Promise<void>;
  listJoinRequests(
    options: FindJoinRequestOptions,
    include?: Prisma.JoinRequestInclude,
  ): Promise<JoinRequest[]>;
  update(id: FleetId, updateInput: Prisma.FleetUpdateInput): Promise<void>;
  delete(options: FindByAdminOptions): Promise<void>;
  clearJoinRequests(options: FindJoinRequestOptions): Promise<void>;
  updateMember(
    findOptions: FindMemberOptions,
    updateInput: Prisma.UserMembershipUpdateInput,
  ): Promise<void>;
}
