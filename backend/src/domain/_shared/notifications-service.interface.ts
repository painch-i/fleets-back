export type SendNotificationOptions = {
  token: string | string[];
  message: string;
  data: any;
};
export interface INotificationsService {
  sendNotification(options: SendNotificationOptions): Promise<void>;
}
