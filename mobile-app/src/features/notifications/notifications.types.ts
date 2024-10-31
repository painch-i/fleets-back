export type SetNotificationTokenOptions = {
  token: string;
};

export type NotificationData =
  | {
      type: 'fleet-gathering-started';
      fleetId: string;
    }
  | {
      type: 'fleet-trip-started';
      fleetId: string;
    }
  | {
      type: 'join-request-received';
      userId: string;
    }
  | {
      type: 'fleet-ended';
      fleetId: string;
    }
  | {
      type: 'presence-confirmed';
      fleetId: string;
      memberId: string;
    };