import { BaseUser } from './base-user.entity';
import {
  CreatePendingUserOptions,
  GenderEnum,
  UserId,
  UserNetwork,
  UserNetworkEnumFromDatabase,
  UserWithOptionalRelations,
} from './user.types';

export class PendingUser extends BaseUser {
  declare id: UserId;
  declare email: string;
  declare firstName: string | null;
  declare lastName: string | null;
  declare birthDate: Date | null;
  declare gender: GenderEnum | null;
  declare isOnboarded: false;
  declare network: UserNetwork | null;

  create(options: CreatePendingUserOptions) {
    this.email = options.email;
    this.isOnboarded = false;
    this.firstName = options.firstName || null;
    this.lastName = options.lastName || null;
    this.birthDate = null;
    this.gender = null;
    this.network = options.network || null;
  }

  static fromDatabase(userFromDb: UserWithOptionalRelations): PendingUser {
    const user = new PendingUser(userFromDb.id);
    user.email = userFromDb.email;
    user.isOnboarded = false;
    user.firstName = userFromDb.firstName;
    user.lastName = userFromDb.lastName;
    user.birthDate = userFromDb.birthDate;
    user.network = userFromDb.network
      ? UserNetworkEnumFromDatabase[userFromDb.network]
      : null;
    return user;
  }
}
