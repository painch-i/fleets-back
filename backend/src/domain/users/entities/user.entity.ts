import { assertIsNotNull } from '../../../utils';
import { Fleet, FleetId } from '../../fleets/entities/fleet.entity';
import { BaseUser } from './base-user.entity';
import {
  CompleteRegistrationOptions,
  CreateUserOptions,
  GenderEnum,
  GenderEnumFromDatabase,
  UserId,
  UserMembershipWithOptionalRelations,
  UserNetwork,
  UserNetworkEnumFromDatabase,
  UserWithOptionalRelations,
} from './user.types';

export class User extends BaseUser {
  declare id: UserId;
  declare email: string;
  declare firstName: string;
  declare lastName: string;
  declare birthDate: Date;
  declare gender: GenderEnum;
  fleetId: FleetId | null = null;
  fleet?: Fleet;
  declare isOnboarded: true;
  declare network: UserNetwork | null;

  static fromDatabase(userFromDb: UserWithOptionalRelations) {
    const id = userFromDb.id;
    const user = new User(id);
    user.email = userFromDb.email;
    user.isOnboarded = true;
    assertIsNotNull(userFromDb.firstName, `User ${id} has no first name`);
    assertIsNotNull(userFromDb.lastName, `User ${id} has no last name`);
    assertIsNotNull(userFromDb.birthDate, `User ${id} has no birth date`);
    assertIsNotNull(userFromDb.gender, `User ${id} has no gender`);

    user.firstName = userFromDb.firstName;
    user.lastName = userFromDb.lastName;
    user.birthDate = new Date(userFromDb.birthDate);
    user.gender = GenderEnumFromDatabase[userFromDb.gender];
    if (userFromDb.memberships && userFromDb.memberships.length > 0) {
      const membership = userFromDb.memberships[0];
      user.fleetId = membership.fleetId;
      if (membership.fleet) {
        user.fleet = Fleet.fromDatabase(membership.fleet);
      }
    }
    user.network = userFromDb.network
      ? UserNetworkEnumFromDatabase[userFromDb.network]
      : null;
    return user;
  }

  create(options: CreateUserOptions) {
    this.email = options.email;
    this.firstName = options.firstName;
    this.lastName = options.lastName;
    this.birthDate = options.birthDate;
  }

  completeRegistration(options: CompleteRegistrationOptions) {
    this.firstName = options.firstName;
    this.lastName = options.lastName;
    this.birthDate = options.birthDate;
    this.gender = options.gender;
    this.isOnboarded = true;
  }
}

export class Member extends User {
  hasConfirmedHisPresence: boolean;
  declare fleetId: FleetId;
  declare fleet?: Fleet;

  static fromMembership(membership: UserMembershipWithOptionalRelations) {
    const id = membership.userId;
    const fleetId = membership.fleetId;
    const member = new Member(id);
    member.fleetId = fleetId;
    member.hasConfirmedHisPresence = membership.hasConfirmedHisPresence;
    if (membership.user) {
      const user = this.fromDatabase(membership.user);
      Object.assign(member, user);
    }
    member.fleetId = membership.fleetId;
    if (membership.fleet) {
      member.fleet = Fleet.fromDatabase(membership.fleet);
    }
    return member;
  }
}
