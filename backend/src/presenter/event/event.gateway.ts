import { Injectable, Logger, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  IEventGateway,
  ServerEvent,
} from 'src/domain/_shared/event-gateway.interface';
import { z } from 'zod';
import { AuthTokenPayload } from '../../domain/_shared/auth-service.interface';
import { FleetId } from '../../domain/fleets/entities/fleet.entity';
import { UserId } from '../../domain/users/entities/user.types';
import { UserOrPendingUser } from '../../domain/users/interfaces/users-repository.interface';
import { AuthService } from '../../infrastructure/authentication/auth.service';
import { UserAuthenticated } from '../../infrastructure/authentication/guards/user-authenticated.auth-guard';
import { UsersRepository } from '../../infrastructure/repositories/users.repository';
import { ZodValidationPipe } from '../http/zod-validation.pipe';

@WebSocketGateway({
  namespace: 'events',
  cors: {
    origin: '*',
  },
})
@Injectable()
export class EventGateway implements IEventGateway, OnGatewayConnection {
  private readonly logger = new Logger(EventGateway.name);

  constructor(
    private readonly authService: AuthService,
    private readonly usersRepository: UsersRepository,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    const token = socket.handshake.auth.token;
    if (token && typeof token === 'string') {
      this.logger.verbose(`Socket connection attempt with token: ${token}`);
      this.upgradeSocketAuth(socket, token);
    } else {
      this.logger.warn(`Socket connection attempt without valid token`);
    }
  }

  @SubscribeMessage('authenticate')
  async authenticate(
    @MessageBody(new ZodValidationPipe(z.string())) token: string,
    @ConnectedSocket() socket: Socket,
  ) {
    this.logger.log(`Authenticating socket with token: ${token}`);
    this.upgradeSocketAuth(socket, token);
  }

  @UseGuards(UserAuthenticated)
  @SubscribeMessage('logout')
  async logout(@ConnectedSocket() socket: Socket) {
    this.logger.log(`User logging out and leaving all rooms.`);
    for (const room of socket.rooms) {
      if (room === socket.id) {
        continue;
      }
      this.logger.debug(`Leaving room: ${room}`);
      socket.leave(room);
    }
  }

  broadcastToFleet(fleetId: FleetId, event: ServerEvent): void {
    const room = `fleet:${fleetId}`;
    this.logger.log(`Broadcasting event to fleet room: ${room}`);
    this.broadcastEventToRoom(room, event);
  }

  broadcastToUser(userId: UserId, event: ServerEvent): void {
    const room = `user:${userId}`;
    this.logger.log(`Broadcasting event to user room: ${room}`);
    this.broadcastEventToRoom(room, event);
  }

  async joinFleetRoom(fleetId: FleetId, userId: UserId) {
    const room = `fleet:${fleetId}`;
    this.logger.log(`User ${userId} joining fleet room: ${room}`);
    this.server.in(`user:${userId}`).socketsJoin(room);
  }

  async leaveFleetRoom(fleetId: FleetId, userId: UserId) {
    const room = `fleet:${fleetId}`;
    this.logger.log(`User ${userId} leaving fleet room: ${room}`);
    this.server.in(`user:${userId}`).socketsLeave(room);
  }

  private broadcastEventToRoom(
    room: string | string[],
    event: ServerEvent,
  ): void {
    this.logger.debug(
      `Broadcasting event to room(s): ${room}, event: ${event.type}`,
    );
    this.server.to(room).emit(event.type, event.payload);
  }

  private invalidateToken(socket: Socket, reason?: string) {
    this.logger.error(`Invalid token for socket. Reason: ${reason}`);
    socket.emit('invalid-token', reason);
    socket.disconnect();
  }

  private async upgradeSocketAuth(socket: Socket, token: string) {
    let tokenPayload: AuthTokenPayload | null = null;
    let user: UserOrPendingUser | null = null;
    try {
      this.logger.verbose(`Verifying token: ${token}`);
      tokenPayload = await this.authService.verifyToken(token);
      this.logger.debug(`Token verified: ${JSON.stringify(tokenPayload)}`);

      this.logger.verbose(`Fetching user with ID: ${tokenPayload.id}`);
      user = await this.usersRepository.getUserById({
        id: tokenPayload.id,
        includePending: true,
      });
      this.logger.debug(`User fetched: ${JSON.stringify(user)}`);
    } catch (error) {
      this.logger.error(`Token verification failed: ${error.message}`);
      this.invalidateToken(socket, error.message);
      return;
    }

    if (user) {
      this.logger.log(`User ${user.id} authenticated, joining rooms`);
      socket.join(`user:${user.id}`);

      if ('fleetId' in user && user.fleetId !== null) {
        this.logger.log(
          `User ${user.id} joining fleet room: fleet:${user.fleetId}`,
        );
        socket.join(`fleet:${user.fleetId}`);
      }
    } else {
      this.logger.warn(
        `No user found for token payload: ${JSON.stringify(tokenPayload)}`,
      );
    }
  }
}
