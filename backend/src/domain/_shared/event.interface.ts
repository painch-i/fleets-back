export interface IEvent {
  id: number;
  createdAt: Date;
  eventType: string;
  aggregateId: string;
  aggregateType: string;
  payload: object;
}
