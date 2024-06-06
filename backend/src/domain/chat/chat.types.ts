import { Prisma } from '@prisma/client';
import { Id } from '../../types';

export class SendMessageOptions {
  fleetId: Id;
  authorId: Id;
  content: string;
}

type MessageRelationWithCount = keyof Prisma.MessageInclude;
type MessageRelation = Exclude<MessageRelationWithCount, '_count'>;
type MessageIncludeAll = {
  [P in MessageRelation]: true;
};

type MessageWithRelations = Prisma.MessageGetPayload<{
  include: MessageIncludeAll;
}>;

export type MessageWithOptionalRelations = Omit<
  MessageWithRelations,
  MessageRelation
> &
  Partial<Pick<MessageWithRelations, MessageRelation>>;
