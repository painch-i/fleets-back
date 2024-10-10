import { assertIsNotNull } from '../../../utils';
import { Fleet, FleetId } from '../../fleets/entities/fleet.entity';
import {
  FleetStatus,
  FleetStatusFromDatabase,
} from '../../fleets/fleets.types';
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
  fleets: Fleet[] = [];
  declare isOnboarded: true;
  declare network: UserNetwork | null;
  declare notificationToken: string | null;

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
    user.fleets = [];
    if (userFromDb.memberships && userFromDb.memberships.length > 0) {
      for (const membership of userFromDb.memberships) {
        if (!membership.fleet) {
          continue;
        }
        const fleet = Fleet.fromDatabase(membership.fleet);
        if (
          [FleetStatus.ARRIVED, FleetStatus.CANCELLED].includes(
            FleetStatusFromDatabase[membership.fleet.status],
          )
        ) {
          user.fleet = fleet;
          user.fleetId = fleet.id;
        } else {
          user.fleets.push(fleet);
        }
      }
    }
    user.network = userFromDb.network
      ? UserNetworkEnumFromDatabase[userFromDb.network]
      : null;
    user.notificationToken = userFromDb.notificationToken
      ? userFromDb.notificationToken
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
