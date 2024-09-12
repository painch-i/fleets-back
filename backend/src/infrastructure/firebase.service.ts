import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { INotificationsService } from '../domain/_shared/notifications-service.interface';

import firebaseServiceAccountKey from '@/../../firebase-service-account-key.json';
const app = admin.initializeApp({
  credential: admin.credential.cert(
    firebaseServiceAccountKey as admin.ServiceAccount,
  ),
  databaseURL:
    'https://fleets-7f5ae-default-rtdb.europe-west1.firebasedatabase.app',
});

@Injectable()
export class FirebaseService implements INotificationsService {
  constructor() {}

  async sendNotification(token: string, message: string): Promise<void> {
    await app.messaging().send({
      token,
      notification: {
        title: 'Fleets',
        body: message,
      },
    });
  }
}
