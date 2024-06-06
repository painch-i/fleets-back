import { Fleet, User } from '@prisma/client';
import { Id } from '../../types';
import { generateId } from '../../utils';
import IEntity from '../_shared/entity.interface';
import { MessageWithOptionalRelations, SendMessageOptions } from './chat.types';

export class Message extends IEntity {
  fleetId: Id;
  fleet?: Fleet;
  content: string;
  authorId: Id;
  author?: User;
  createdAt: Date;

  send(options: SendMessageOptions) {
    this.id = generateId();
    this.fleetId = options.fleetId;
    this.authorId = options.authorId;
    this.content = options.content;
  }

  static fromDatabase(messageFromDb: MessageWithOptionalRelations): Message {
    const message = new Message();
    message.id = messageFromDb.id;
    message.fleetId = messageFromDb.fleetId;
    message.authorId = messageFromDb.authorId;
    message.content = messageFromDb.content;
    message.createdAt = messageFromDb.createdAt;
    message.fleet = messageFromDb.fleet;
    message.author = messageFromDb.author;
    return message;
  }
}
