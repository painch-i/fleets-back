export type SendNotificationOptions = {
  token: string | string[];
  message: string;
  title: string;
  data: any;
};
export interface INotificationsService {
  sendNotification(options: SendNotificationOptions): Promise<void>;
}
