import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import {
  INotificationsService,
  SendNotificationOptions,
} from '../domain/_shared/notifications-service.interface';

// Check if /etc/secrets/firebase-service-account-key.json exists
// If it does, use it as the service account key
// Otherwise, use the one in the repository
let firebaseServiceAccountKey;
try {
  firebaseServiceAccountKey = require('/etc/secrets/firebase-service-account-key.json');
} catch (e) {
  firebaseServiceAccountKey = require('@/../../firebase-service-account-key.json');
}

const app = admin.initializeApp({
  credential: admin.credential.cert(
    firebaseServiceAccountKey as admin.ServiceAccount,
  ),
  databaseURL:
    'https://fleets-7f5ae-default-rtdb.europe-west1.firebasedatabase.app',
});

@Injectable()
export class FirebaseService implements INotificationsService {
  logger = new Logger(FirebaseService.name);
  constructor() {}

  async sendNotification(options: SendNotificationOptions): Promise<void> {
    await app
      .messaging()
      .sendEachForMulticast({
        tokens:
          typeof options.token === 'string' ? [options.token] : options.token,
        notification: {
          title: options.title,
          body: options.message,
        },
        data: options.data,
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              contentAvailable: false,
            },
          },
        },
      })
      .catch((e) => {
        this.logger.error(e, e.stack);
      });
  }
}
