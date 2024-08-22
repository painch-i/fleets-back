import { $Enums, Prisma } from '@prisma/client';
import { z } from 'zod';
import { Id } from '../../../types';
import { completeRegistrationOptionsSchema } from '../validation/complete-registration-options.schema';
import { createPendingUserOptionsSchema } from '../validation/create-pending-user-options.schema';
import { findUserByEmailOptionsSchema } from '../validation/find-by-email-options.schema';
import { verifyOTPOptionsSchema } from '../validation/verify-otp-options.schema';

export type UserId = Id;

export enum GenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

type UserRelationWithCount = keyof Prisma.UserInclude;
type UserRelation = Exclude<UserRelationWithCount, '_count'>;
type UserIncludeAll = {
  [P in UserRelation]: true;
};
// 2: This type will include many users and all their cars
type UserWithRelations = Prisma.UserGetPayload<{
  include: UserIncludeAll;
}> & { memberships: UserMembershipWithOptionalRelations[] };

export type UserWithOptionalRelations = Omit<UserWithRelations, UserRelation> &
  Partial<Pick<UserWithRelations, UserRelation>>;

type UserMembershipRelationWithCount = keyof Prisma.UserMembershipInclude;
type UserMembershipRelation = Exclude<
  UserMembershipRelationWithCount,
  '_count'
>;
type UserMembershipIncludeAll = {
  [P in UserMembershipRelation]: true;
};
// 2: This type will include many users and all their cars
type UserMembershipWithRelations = Prisma.UserMembershipGetPayload<{
  include: UserMembershipIncludeAll;
}>;

export type UserMembershipWithOptionalRelations = Omit<
  UserMembershipWithRelations,
  UserMembershipRelation
> &
  Partial<Pick<UserMembershipWithRelations, UserMembershipRelation>>;

export enum VerificationStatus {
  NOT_STARTED = 'NOT_STARTED',
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  INVALID = 'INVALID',
}

export enum UserNetwork {
  ETNA = 'ETNA',
}

export const UserNetworkEnumFromDatabase: Record<
  $Enums.UserNetwork,
  UserNetwork
> = {
  [$Enums.UserNetwork.ETNA]: UserNetwork.ETNA,
};

export const UserNetworkEnumToDatabase: Record<
  UserNetwork,
  $Enums.UserNetwork
> = {
  [UserNetwork.ETNA]: $Enums.UserNetwork.ETNA,
};
export const GenderEnumFromDatabase: Record<$Enums.Gender, GenderEnum> = {
  [$Enums.Gender.MALE]: GenderEnum.MALE,
  [$Enums.Gender.FEMALE]: GenderEnum.FEMALE,
};

export const GenderEnumToDatabase: Record<GenderEnum, $Enums.Gender> = {
  [GenderEnum.MALE]: $Enums.Gender.MALE,
  [GenderEnum.FEMALE]: $Enums.Gender.FEMALE,
};

export type FindUserByEmailOptions = z.infer<typeof findUserByEmailOptionsSchema>;

export type CreatePendingUserOptions = z.infer<
  typeof createPendingUserOptionsSchema
>;

export type CreateUserOptions = {
  email: string;
  gender: GenderEnum;
  firstName: string;
  lastName: string;
  birthDate: Date;
};

export type CompleteRegistrationOptions = z.infer<
  typeof completeRegistrationOptionsSchema
>;

export type VerifyOTPOptions = z.infer<typeof verifyOTPOptionsSchema>;
