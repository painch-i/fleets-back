/**
 * Module qui définit le service d'authentification Firebase.
 * @module AuthService
 */

import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import admin from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { Socket } from 'socket.io';
import firebaseServiceAccountKey from '../../../firebase-service-account-key.json';
import { getTokenFromRequest, getTokenFromWsClient } from '../../utils';

/**
 * Service injectable qui gère l'authentification Firebase.
 * @class
 */
@Injectable()
export class FirebaseJwtService {
  /**
   * Crée une instance de AuthService et initialise Firebase.
   * @constructor
   */
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(
        firebaseServiceAccountKey as admin.ServiceAccount,
      ),
    });
  }

  /**
   * Méthode pour décoder le token Firebase et vérifier l'authentification de l'utilisateur.
   * @async
   * @param {Request} request - L'objet Request de la requête HTTP.
   * @returns {Promise<DecodedIdToken | undefined>} L'objet décodé du token Firebase ou undefined.
   */
  async getDecodedFirebaseIdToken(
    token: string,
    checkRevoked,
  ): Promise<DecodedIdToken | undefined> {
    try {
      const decodedIdToken = await admin
        .auth()
        .verifyIdToken(token, checkRevoked);
      return decodedIdToken;
    } catch (error) {
      console.error('Error while verifying Firebase ID token:', error);
      return;
    }
  }

  getFirebaseCustomToken(
    uid: string,
    additionalClaims?: object,
  ): Promise<string> {
    return admin.auth().createCustomToken(uid, additionalClaims);
  }
}

export async function getDecodedFirebaseIdTokenFromHttpRequest(
  request: Request,
): Promise<DecodedIdToken | null> {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }
  const decodedIdToken = await admin.auth().verifyIdToken(token, false);
  return decodedIdToken;
}

export async function getDecodedFirebaseIdTokenFromWsClient(
  client: Socket,
): Promise<DecodedIdToken | null> {
  const token = getTokenFromWsClient(client);
  if (!token) {
    return null;
  }
  return await admin.auth().verifyIdToken(token, false);
}
