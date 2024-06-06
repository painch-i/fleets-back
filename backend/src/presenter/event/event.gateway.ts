import { Injectable, UseGuards } from '@nestjs/common';
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
import { FleetId } from '../../domain/fleets/entities/fleet.entity';
import { UserId } from '../../domain/users/entities/user.entity';
import { AuthService } from '../../infrastructure/authentication/auth.service';
import { UserAuthenticated } from '../../infrastructure/authentication/guards/user-authenticated.auth-guard';
import { UsersRepository } from '../../infrastructure/repositories/users.repository';
import { ZodValidationPipe } from '../http/zod-validation.pipe';
import { AuthTokenPayload } from '../../domain/_shared/auth-service.interface';
import { UserOrPendingUser } from '../../domain/users/interfaces/users-repository.interface';

@UseGuards(UserAuthenticated)
@WebSocketGateway({
  namespace: 'events',
  cors: {
    origin: '*',
  },
})
@Injectable()
export class EventGateway implements IEventGateway, OnGatewayConnection {
  constructor(
    private readonly authService: AuthService,
    private readonly usersRepository: UsersRepository,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    const token = socket.handshake.auth.token;
    if (token && typeof token === 'string') {
      this.upgradeSocketAuth(socket, token);
    }
  }

  @SubscribeMessage('authenticate')
  async authenticate(
    @MessageBody(new ZodValidationPipe(z.string())) token: string,
    @ConnectedSocket() socket: Socket,
  ) {
    this.upgradeSocketAuth(socket, token);
  }

  @SubscribeMessage('logout')
  async logout(@ConnectedSocket() socket: Socket) {
    for (const room of socket.rooms) {
      if (room === socket.id) {
        continue;
      }
      socket.leave(room);
    }
  }

  broadcastToFleet(fleetId: FleetId, event: ServerEvent): void {
    const room = `fleet:${fleetId}`;
    this.broadcastEventToRoom(room, event);
  }

  broadcastToUser(userId: UserId, event: ServerEvent): void {
    const room = `user:${userId}`;
    this.broadcastEventToRoom(room, event);
  }

  async joinFleetRoom(fleetId: FleetId, userId: UserId) {
    const room = `fleet:${fleetId}`;
    this.server.in(`user:${userId}`).socketsJoin(room);
  }
  async leaveFleetRoom(fleetId: FleetId, userId: UserId) {
    const room = `fleet:${fleetId}`;
    this.server.in(`user:${userId}`).socketsLeave(room);
  }

  private broadcastEventToRoom(
    room: string | string[],
    event: ServerEvent,
  ): void {
    this.server.to(room).emit(event.type, event.payload);
  }

  private invalidateToken(socket: Socket, reason?: string) {
    socket.emit('invalid-token', reason);
    socket.disconnect();
  }

  private async upgradeSocketAuth(socket: Socket, token: string) {
    let tokenPayload: AuthTokenPayload | null = null;
    let user: UserOrPendingUser | null = null;
    try {
      tokenPayload = await this.authService.verifyToken(token);
      user = await this.usersRepository.getUserById({
        id: tokenPayload.id,
        includePending: true,
      });
    } catch (error) {
      this.invalidateToken(socket, error.message);
    }
    if (user) {
      socket.join(`user:${user.id}`);
      if ('fleetId' in user && user.fleetId !== null) {
        socket.join(`fleet:${user.fleetId}`);
      }
    }
  }
}
