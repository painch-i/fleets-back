// /**
//  * Module qui définit le middleware de vérification d'authentification utilisateur.
//  * @module UserOwned
//  */

// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { Socket } from 'socket.io';
// import { FirebaseJwtService } from '../firebase-jwt.service';

// /**
//  * Injectable middleware qui implémente CanActivate pour vérifier l'authentification utilisateur.
//  * @class
//  * @implements CanActivate
//  */
// @Injectable()
// export class UserOwned implements CanActivate {
//   /**
//    * Crée une instance de UserAuthenticated.
//    * @constructor
//    * @param {FirebaseJwtService} jwtService - Le service d'authentification.
//    */
//   constructor(private readonly jwtService: FirebaseJwtService) {}

//   /**
//    * Méthode pour vérifier l'authentification utilisateur.
//    * @async
//    * @param {ExecutionContext} context - Le contexte d'exécution.
//    * @returns {Promise<boolean>} Un booléen indiquant si l'utilisateur est authentifié.
//    */
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     switch (context.getType()) {
//       // case 'http':
//       //   return await this.validateHttpRequest(
//       //     context.switchToHttp().getRequest<Request>(),
//       //   );
//       case 'ws':
//         return this.validateWsClient(context.switchToWs().getClient());
//       // case 'rpc':
//       //   return this.validateRpcContext(context.switchToRpc().getContext());
//       default:
//         return false;
//     }
//   }

//   async validateWsClient(socket: Socket): Promise<boolean> {
//     const token = socket.handshake.auth.token;
//     if (!token) {
//       return false; // Pas de jeton, l'utilisateur n'est pas authentifié
//     }

//     const decodedIdToken = await this.jwtService.getDecodedFirebaseIdToken(
//       token,
//       true,
//     );
//     if (!decodedIdToken) {
//       return false;
//     }
//     return true;
//   }
//   // validateRpcContext(arg0: any): boolean | Promise<boolean> | Observable<boolean> {
//   //   throw new Error('Method not implemented.');
//   // }
// }
