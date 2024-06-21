import { UserId } from '../users/entities/user.types';

export type ResourceType = {
  fleets: string;
  users: string;
};

export type AuthTokenPayload = {
  id: UserId;
  email: string;
  iat: number;
  exp: number;
};

export type CreateAuthTokenOptions = {
  id: UserId;
  email: string;
};

export interface IAuthService {
  verifyToken(token: string): Promise<AuthTokenPayload>;
  verifyOTP(email: string, otp: string): Promise<boolean>;
  createOTP(email: string): Promise<string>;
  createToken(options: CreateAuthTokenOptions): Promise<string>;
  // isUserFleetMember(userId: string, fleetId: FleetId): Promise<boolean>;
  // isUserFleetOwner(userId: string, fleetId: FleetId): Promise<boolean>;
  // addFleetMembers(fleet: Fleet): Promise<boolean>;
  // getFleetMemberIds(fleetId: FleetId): Promise<string[]>;
  // removeUserFromFleet(userId: string, fleetId: FleetId): Promise<boolean>;
  // addUserAsFleetOwner(userId: string, fleetId: FleetId): Promise<boolean>;
  // removeUserAsFleetOwner(userId: string, fleetId: FleetId): Promise<boolean>;
}
