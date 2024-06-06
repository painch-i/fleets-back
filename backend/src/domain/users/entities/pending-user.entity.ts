import IEntity from '../../_shared/entity.interface';
import { GenderEnum } from '../value-objects/gender.value-object';
import {
  FindUserByEmailOptions,
  UserWithOptionalRelations,
} from './user.types';

export class PendingUser extends IEntity {
  email: string;
  firstName: string | null;
  lastName: string | null;
  birthDate: Date | null;
  gender: GenderEnum | null;
  isOnboarded: false;
  create(options: FindUserByEmailOptions) {
    this.email = options.email;
    this.isOnboarded = false;
    this.firstName = null;
    this.lastName = null;
    this.birthDate = null;
    this.gender = null;
  }

  static fromDatabase(userFromDb: UserWithOptionalRelations): PendingUser {
    const user = new PendingUser(userFromDb.id);
    user.email = userFromDb.email;
    user.isOnboarded = false;
    user.firstName = userFromDb.firstName;
    user.lastName = userFromDb.lastName;
    user.birthDate = userFromDb.birthDate;
    return user;
  }
}
