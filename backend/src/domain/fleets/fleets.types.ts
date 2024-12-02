import { $Enums, Prisma } from '@prisma/client';
import { z } from 'zod';
import {
  UserId,
  UserMembershipWithOptionalRelations,
} from '../users/entities/user.types';
import { FleetId } from './entities/fleet.entity';
import { getCreateFleetOptionsSchema } from './validation-schemas/create-fleet-options.schema';
import { createJoinRequestOptionsSchema } from './validation-schemas/create-join-request-options.schema';
import { findByAdminOptionsSchema } from './validation-schemas/find-by-admin-options.schema';
import { findByIdOptionsSchema } from './validation-schemas/find-by-id-options.schema';
import { findByMemberAndAdminOptionsSchema } from './validation-schemas/find-by-member-options.schema';
import { getFleetOptionsSchema } from './validation-schemas/get-fleet-options.schema';
import { lineTakenSchema } from './validation-schemas/line-taken.schema';
import { listJoinRequestOptionsSchema } from './validation-schemas/list-join-request-options.schema';
import { removeMemberOptionsSchema } from './validation-schemas/remove-member-options.schema';
import { respondToRequestOptionsSchema } from './validation-schemas/respond-to-request-options.schema';
import { getSearchFleetsOptionsSchema } from './validation-schemas/search-fleets-options.schema';

export type CreateFleetOptions = z.infer<
  ReturnType<typeof getCreateFleetOptionsSchema>
>;
export type GetFleetOptions = z.infer<typeof getFleetOptionsSchema>;
export type SearchFleetsOptions = z.infer<
  ReturnType<typeof getSearchFleetsOptionsSchema>
>;
export type CreateJoinRequestOptions = z.infer<
  typeof createJoinRequestOptionsSchema
>;
export type RespondToRequestOptions = z.infer<
  typeof respondToRequestOptionsSchema
>;
export type ListJoinRequestOptions = z.infer<
  typeof listJoinRequestOptionsSchema
>;

export enum GenderConstraintEnum {
  MALE_ONLY = 'MALE_ONLY',
  FEMALE_ONLY = 'FEMALE_ONLY',
  NO_CONSTRAINT = 'NO_CONSTRAINT',
}

export enum GenderConstraintCreationConfigEnum {
  USER_GENDER_ONLY = 'USER_GENDER_ONLY',
  ANY_GENDER = 'ANY_GENDER',
}

export type FindByIdOptions = z.infer<typeof findByIdOptionsSchema>;
export type FindByAdminOptions = z.infer<typeof findByAdminOptionsSchema>;

export type FindJoinRequestOptions = {
  administratorId?: UserId;
  fleetId: FleetId;
  userId?: UserId;
};

export type FindByMemberAndAdminOptions = z.infer<
  typeof findByMemberAndAdminOptionsSchema
>;

export type RemoveMemberOptions = z.infer<typeof removeMemberOptionsSchema>;

export enum JoinRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export enum FleetStatus {
  FORMATION = 'formation',
  GATHERING = 'gathering',
  TRAVELING = 'traveling',
  ARRIVED = 'arrived',
  CANCELLED = 'cancelled',
}

export const FleetStatusFromDatabase: Record<$Enums.FleetStatus, FleetStatus> =
  {
    [$Enums.FleetStatus.FORMATION]: FleetStatus.FORMATION,
    [$Enums.FleetStatus.GATHERING]: FleetStatus.GATHERING,
    [$Enums.FleetStatus.TRAVELING]: FleetStatus.TRAVELING,
    [$Enums.FleetStatus.ARRIVED]: FleetStatus.ARRIVED,
    [$Enums.FleetStatus.CANCELLED]: FleetStatus.CANCELLED,
  };

export const FleetStatusToDatabase: Record<FleetStatus, $Enums.FleetStatus> = {
  [FleetStatus.FORMATION]: $Enums.FleetStatus.FORMATION,
  [FleetStatus.GATHERING]: $Enums.FleetStatus.GATHERING,
  [FleetStatus.TRAVELING]: $Enums.FleetStatus.TRAVELING,
  [FleetStatus.ARRIVED]: $Enums.FleetStatus.ARRIVED,
  [FleetStatus.CANCELLED]: $Enums.FleetStatus.CANCELLED,
};

export const JoinRequestStatusFromDatabase: Record<
  $Enums.JoinRequestStatus,
  JoinRequestStatus
> = {
  [$Enums.JoinRequestStatus.PENDING]: JoinRequestStatus.PENDING,
  [$Enums.JoinRequestStatus.ACCEPTED]: JoinRequestStatus.ACCEPTED,
  [$Enums.JoinRequestStatus.REJECTED]: JoinRequestStatus.REJECTED,
};

export const JoinRequestStatusToDatabase: Record<
  JoinRequestStatus,
  $Enums.JoinRequestStatus
> = {
  [JoinRequestStatus.PENDING]: $Enums.JoinRequestStatus.PENDING,
  [JoinRequestStatus.ACCEPTED]: $Enums.JoinRequestStatus.ACCEPTED,
  [JoinRequestStatus.REJECTED]: $Enums.JoinRequestStatus.REJECTED,
};

type FleetRelationWithCount = keyof Prisma.FleetInclude;
type FleetRelation = Exclude<FleetRelationWithCount, '_count'>;
type FleetIncludeAll = {
  [P in FleetRelation]: true;
};

type FleetWithRelations = Prisma.FleetGetPayload<{
  include: FleetIncludeAll;
}> & { memberships: UserMembershipWithOptionalRelations[] };

export type FleetWithOptionalRelations = Omit<
  FleetWithRelations,
  FleetRelation
> &
  Partial<Pick<FleetWithRelations, FleetRelation>>;

export type LineTaken = z.infer<typeof lineTakenSchema>;
