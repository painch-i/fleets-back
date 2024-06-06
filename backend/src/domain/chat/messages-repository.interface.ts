import { FleetId } from '../fleets/entities/fleet.entity';
import { Message } from './message.entity';

export interface IMessagesRepository {
  persistMessage(message: Message): Promise<Message>;
  getFleetMessages(fleetId: FleetId): Promise<Message[]>;
}
