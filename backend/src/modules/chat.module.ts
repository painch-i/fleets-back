import { Module } from '@nestjs/common';
import { ChatManager } from '../domain/chat/chat.manager';
import { PrismaService } from '../infrastructure/persistence/read-database/prisma/prisma.service';
import { MessagesRepository } from '../infrastructure/repositories/messages.repository';
import { UsersRepository } from '../infrastructure/repositories/users.repository';
import { EventGateway } from '../presenter/event/event.gateway';
import { ChatController } from '../presenter/http/chat.controller';
import { AuthModule } from './auth.module';
import { EventStore } from '../infrastructure/events/event-store.service';

@Module({
  imports: [AuthModule],
  controllers: [ChatController],
  providers: [
    ChatManager,
    MessagesRepository,
    PrismaService,
    EventGateway,
    UsersRepository,
    EventStore,
  ],
  exports: [ChatManager],
})
export class ChatModule {}
