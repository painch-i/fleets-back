export interface INotificationsService {
  sendNotification(token: string | string[], message: string): Promise<void>;
}
