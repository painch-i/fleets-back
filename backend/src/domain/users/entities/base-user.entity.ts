import { UserNetwork } from '@prisma/client';
import IEntity from '../../_shared/entity.interface';
import { GenderEnum } from '../value-objects/gender.value-object';
import { UserId } from './user.types';

export class BaseUser extends IEntity {
  declare id: UserId;
  email: string;
  firstName: string | null;
  lastName: string | null;
  birthDate: Date | null;
  gender: GenderEnum | null;
  isOnboarded: boolean;
  network: UserNetwork | null;
}
