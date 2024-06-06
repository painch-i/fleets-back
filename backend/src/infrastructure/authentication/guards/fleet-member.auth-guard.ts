// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { Request } from 'express';
// import get from 'lodash.get';
// import { Socket } from 'socket.io';
// import { AuthService } from '../auth.service';
// import { JwtService, getTokenFromRequest } from '../firebase-jwt.service';
// import { FleetIdMetadataKey } from './decorators/fleet-id-path.decorator';

// @Injectable()
// export class FleetMember implements CanActivate {
//   /**
//    * Crée une instance de UserAuthenticated.
//    * @constructor
//    * @param {JwtService} authService - Le service d'authentification.
//    */
//   constructor(
//     private readonly authService: AuthService,
//     private readonly jwtService: JwtService,
//     private reflector: Reflector,
//   ) {}

//   /**
//    * Méthode pour vérifier l'authentification utilisateur.
//    * @async
//    * @param {ExecutionContext} context - Le contexte d'exécution.
//    * @returns {Promise<boolean>} Un booléen indiquant si l'utilisateur est authentifié.
//    */
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const fleetIdPath = this.reflector.get<string>(
//       FleetIdMetadataKey,
//       context.getHandler(),
//     );
//     switch (context.getType()) {
//       case 'http':
//         return await this.validateHttpRequest(
//           context.switchToHttp().getRequest<Request>(),
//         );
//       case 'ws':
//         return this.validateWsClient(
//           context.switchToWs().getClient(),
//           context.switchToWs().getData(),
//           fleetIdPath,
//         );
//       // case 'rpc':
//       //   return this.validateRpcContext(context.switchToRpc().getContext());
//       default:
//         return false;
//     }
//   }
//   /**
//    * Méthode pour valider une requête HTTP.
//    * @async
//    * @param {Request} request - L'objet Request de la requête HTTP.
//    * @returns {Promise<boolean>} Un booléen indiquant si l'utilisateur est authentifié.
//    */
//   async validateHttpRequest(request: Request): Promise<boolean> {
//     const token = getTokenFromRequest(request);
//     if (!token) {
//       return false;
//     }
//     const decodedIdToken = await this.jwtService.getDecodedFirebaseIdToken(
//       token,
//       true,
//     );
//     if (!decodedIdToken) {
//       return false;
//     }
//     if (!request.params.fleetId) {
//       return false;
//     }
//     if (request.params.fleetId === 'current') {
//       const userFleetId = await this.authService.getFleetIdFromUserId(
//         decodedIdToken.uid,
//       );
//       return !!userFleetId;
//     }
//     const isMember = await this.authService.isUserFleetMember(
//       decodedIdToken.uid,
//       request.params.fleetId,
//     );
//     return isMember;
//   }

//   async validateWsClient(
//     client: Socket,
//     data: any,
//     fleetIdPath: string,
//   ): Promise<boolean> {
//     const token = client.handshake.auth.token;
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
//     if (!fleetIdPath) {
//       return false;
//     }
//     const fleetId = getFleetIdFromPath(data, fleetIdPath);
//     if (!fleetId) {
//       return false;
//     }
//     const isMember = await this.authService.isUserFleetMember(
//       decodedIdToken.uid,
//       fleetId,
//     );
//     return isMember;
//   }
// }

// function getFleetIdFromPath(data: any, path: string): string | null {
//   const value = get(data, path);
//   if (typeof value === 'string') {
//     return value;
//   }
//   return null;
// }
