import { FleetId } from '../fleets/entities/fleet.entity';
import { UserId } from '../users/entities/user.entity';

export type ServerEvent = {
  type: string;
  payload: any;
};

export interface IEventGateway {
  broadcastToFleet(fleetId: FleetId, event: ServerEvent): void;
  broadcastToUser(userId: UserId, event: ServerEvent): void;
  joinFleetRoom(fleetId: FleetId, userId: UserId): void;
  leaveFleetRoom(fleetId: FleetId, userId: UserId): void;
}
