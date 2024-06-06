import { FleetId } from '../entities/fleet.entity';

type TaskType = 'start-gathering' | 'start-trip';

export type Task = {
  type: TaskType;
  fleetId: FleetId;
};
export interface ITaskScheduler {
  scheduleGathering(fleetId: FleetId, gatheringTime: Date): Promise<void>;
  scheduleDeparture(fleetId: FleetId, departureTime: Date): Promise<void>;
  deleteScheduledTask(task: Task): Promise<void>;
}
