import { Module } from '@nestjs/common';
import { ChatManager } from '../domain/chat/chat.manager';
import { EventStore } from '../infrastructure/events/event-store.service';
import { MessagesRepository } from '../infrastructure/repositories/messages.repository';
import { UsersRepository } from '../infrastructure/repositories/users.repository';
import { EventGateway } from '../presenter/event/event.gateway';
import { ChatController } from '../presenter/http/chat.controller';
import { AuthModule } from './auth.module';
import { DatabaseModule } from './database.module';

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [ChatController],
  providers: [
    ChatManager,
    MessagesRepository,
    EventGateway,
    UsersRepository,
    EventStore,
  ],
  exports: [ChatManager],
})
export class ChatModule {}
