import { Fleet, FleetID } from '@/features/fleets/types/fleet.types';
import { User, UserId } from '@/features/auth/types/user.types';

export enum JoinRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export interface JoinRequest {
  fleetId: FleetID;
  fleet?: Fleet;
  userId: UserId;
  user?: User;
  status: JoinRequestStatus;
}

export interface RespondToRequestDto {
  userId: UserId;
  accepted: boolean;
}
