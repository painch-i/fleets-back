import { Injectable } from '@nestjs/common';
import { Message } from '../../domain/chat/message.entity';
import { IMessagesRepository } from '../../domain/chat/messages-repository.interface';
import { Id } from '../../types';
import { PrismaService } from '../persistence/read-database/prisma/prisma.service';

@Injectable()
export class MessagesRepository implements IMessagesRepository {
  constructor(private prisma: PrismaService) {}
  async persistMessage(message: Message): Promise<Message> {
    const createdMessage = await this.prisma.message.create({
      data: {
        id: message.id,
        content: message.content,
        authorId: message.authorId,
        fleetId: message.fleetId,
      },
    });
    return Message.fromDatabase(createdMessage);
  }
  async getFleetMessages(fleetId: Id): Promise<Message[]> {
    const messages = await this.prisma.message.findMany({
      where: {
        fleetId: fleetId,
      },
    });
    return messages.map(Message.fromDatabase);
  }
}
