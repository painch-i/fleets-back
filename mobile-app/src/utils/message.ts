import { DryMessage, Message } from '@/features/chat/chat.types';

export function hydrateMessages(
  dryMessages: DryMessage[] | undefined,
  userId: string,
) {
  const messages: Message[] = [];

  if (dryMessages) {
    for (const message of dryMessages) {
      const hydratedMessage: Message = hydrateMessage(message, userId);
      messages.push(hydratedMessage);
    }
  }

  return messages;
}

export function hydrateMessage(
  dryMessage: DryMessage,
  userId: string,
): Message {
  return {
    ...dryMessage,
    status: 'sent',
    isMine: dryMessage.authorId === userId,
  };
}
