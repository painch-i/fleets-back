import { Prisma } from '@prisma/client';
import { Id } from '../../../types';
import { PendingUser } from '../entities/pending-user.entity';
import { User } from '../entities/user.entity';

export type OneTimePassword = {
  email: string;
  code: string;
  expiresAt: Date;
  createdAt: Date;
};

type DoesNotExist = {
  exists: false;
};

type Exists = {
  exists: true;
  id: Id;
};

export type GetUserByIdOptions = {
  id: Id;
  include?: Prisma.UserInclude;
  includePending?: boolean;
};

// définissez un type générique pour le type de retour de la fonction getUserById
export type GetUserByIdReturnType<TIncludePending extends boolean> =
  TIncludePending extends true ? UserOrPendingUser : User;

export type ExistsReturn = DoesNotExist | Exists;
export type UserOrPendingUser = User | PendingUser;
export interface IUsersRepository {
  getUserByEmail(email: string): Promise<UserOrPendingUser>;
  existsByEmail(email: string): Promise<ExistsReturn>;
  getUserById<TIncludePending extends boolean>(
    options: GetUserByIdOptions & {
      includePending: TIncludePending;
    },
  ): Promise<GetUserByIdReturnType<TIncludePending>>;
  createPendingUser(user: PendingUser): Promise<PendingUser>;
  setOTP(email: string, otp: string, expiry: Date): Promise<void>;
  getOTP(email: string): Promise<OneTimePassword>;
  deleteOTP(email: string): Promise<void>;
  updateUser(user: UserOrPendingUser): Promise<UserOrPendingUser>;
  setNotificationToken(options: { userId: Id; token: string }): Promise<User>;
}
