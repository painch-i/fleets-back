import React, { createContext, useEffect } from 'react';

import { useMessagesQuery } from '@/features/chat/api/use-messages.query';
import { useSendMessageMutation } from '@/features/chat/api/use-send-message.mutation';
import {
  DryMessage,
  IMessagesContext,
  Message,
} from '@/features/chat/chat.types';

import { useEventSocket } from '@/providers/event-socket.provider';
import { hydrateMessage, hydrateMessages } from '@/utils/message';

const MessagesContext = createContext<IMessagesContext>({
  messages: [],
  sendMessage: () => {},
  isLoading: true,
});

interface MessagesProviderProps {
  fleetId: string;
  userId: string;
  children: React.ReactNode;
}

/**
 * Context provider for managing messages state, providing messages data, sending messages and handling messages-related event socket listeners.
 *
 * @param {MessagesProviderProps} {@link MessagesProviderProps} - Params for the MessagesProvider, including the children components that will have access to the messages context, the current UserId & the current FleetId.
 *
 * @note All event socket listeners linked to the messages should be managed within this provider.
 */
export function MessagesProvider({
  children,
  fleetId,
  userId,
}: MessagesProviderProps) {
  const { socket } = useEventSocket();

  const { data: serverMessages, isPending } = useMessagesQuery(fleetId);
  const sendMessageMutation = useSendMessageMutation(fleetId);

  const [messages, setMessage] = React.useState<Message[]>(
    hydrateMessages(serverMessages, userId),
  );

  useEffect(() => {
    setMessage(hydrateMessages(serverMessages, userId));
  }, [serverMessages, userId]);

  const sendMessage = (content: string) => {
    const pendingMessage: Message = {
      fleetId,
      authorId: userId,
      id: Math.random().toString(),
      content,
      createdAt: new Date(),
      status: 'pending',
      isMine: true,
    };

    setMessage((messages) => [...messages, pendingMessage]);

    sendMessageMutation
      .mutateAsync({
        content,
      })
      .then((persistedMessage) => {
        setMessage((messages) => {
          const newMessages = [...messages];

          const pendingMessageIndex = newMessages.findIndex(
            (message) => message.id === pendingMessage.id,
          );

          newMessages[pendingMessageIndex] = {
            ...newMessages[pendingMessageIndex],
            ...persistedMessage,
            status: 'sent',
          };

          return newMessages;
        });
      })
      .catch(() => {
        setMessage((messages) => {
          const newMessages = [...messages];

          const pendingMessageIndex = newMessages.findIndex(
            (message) => message.id === pendingMessage.id,
          );

          newMessages[pendingMessageIndex] = {
            ...newMessages[pendingMessageIndex],
            status: 'error',
          };

          return newMessages;
        });
      });
  };

  const sortedMessages = messages.sort((a, b) => {
    if (a.createdAt < b.createdAt) return -1;
    if (a.createdAt > b.createdAt) return 1;
    return 0;
  });

  const onNewMessage = (message: DryMessage) => {
    setMessage((messages) => {
      if (message.authorId === userId) {
        return messages;
      }

      const hydratedMessage: Message = hydrateMessage(message, userId);

      return [...messages, hydratedMessage];
    });
  };

  useEffect(
    function subscribeToNewMessages() {
      socket.on('message-received', onNewMessage);

      return () => {
        socket.off('message-received', onNewMessage);
      };
    },
    [socket, fleetId],
  );

  return (
    <MessagesContext.Provider
      value={{ messages: sortedMessages, sendMessage, isLoading: isPending }}
    >
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const context = React.useContext(MessagesContext);

  if (context === undefined) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }

  return context;
}
