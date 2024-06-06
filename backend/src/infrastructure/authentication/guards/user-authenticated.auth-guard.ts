/**
 * Module qui définit le middleware de vérification d'authentification utilisateur.
 * @module UserAuthenticated
 */

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Socket } from 'socket.io';
import { getTokenFromRequest } from '../../../utils';
import { AuthService } from '../auth.service';

/**
 * Injectable middleware qui implémente CanActivate pour vérifier l'authentification utilisateur.
 * @class
 * @implements CanActivate
 */
@Injectable()
export class UserAuthenticated implements CanActivate {
  /**
   * Crée une instance de UserAuthenticated.
   * @constructor
   * @param {AuthService} authService - Le service d'authentification.
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * Méthode pour vérifier l'authentification utilisateur.
   * @async
   * @param {ExecutionContext} context - Le contexte d'exécution.
   * @returns {Promise<boolean>} Un booléen indiquant si l'utilisateur est authentifié.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    switch (context.getType()) {
      case 'http':
        return await this.validateHttpRequest(
          context.switchToHttp().getRequest<Request>(),
        );
      case 'ws':
        return this.validateWsClient(context.switchToWs().getClient());
      // case 'rpc':
      //   return this.validateRpcContext(context.switchToRpc().getContext());
      default:
        throw new UnauthorizedException('Invalid context type');
    }
  }

  /**
   * Méthode pour valider une requête HTTP.
   * @async
   * @param {Request} request - L'objet Request de la requête HTTP.
   * @returns {Promise<boolean>} Un booléen indiquant si l'utilisateur est authentifié.
   */
  async validateHttpRequest(request: Request): Promise<boolean> {
    const token = getTokenFromRequest(request);
    if (!token) {
      throw new UnauthorizedException('No token found in request');
    }
    try {
      const decodedIdToken = await this.authService.verifyToken(token);
      if (!decodedIdToken) {
        throw new UnauthorizedException('Invalid token');
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }

  async validateWsClient(client: Socket): Promise<boolean> {
    const token = client.handshake.auth.token;
    if (!token) {
      return false;
    }
    try {
      const decodedIdToken = await this.authService.verifyToken(token);
      if (!decodedIdToken) {
        return false;
      }
    } catch (error) {
      return false;
    }
    return true;
  }
  // validateRpcContext(arg0: any): boolean | Promise<boolean> | Observable<boolean> {
  //   throw new Error('Method not implemented.');
  // }
}
