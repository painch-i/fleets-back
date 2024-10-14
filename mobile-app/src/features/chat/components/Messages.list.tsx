import React, { useEffect } from 'react';
import { IonSpinner } from '@ionic/react';

import MessageBubble from '@/features/chat/components/Message.bubble';
import { useMessages } from '@/features/chat/messages.provider';
import { useCurrentFleet } from '@/features/fleets/providers/current-fleet.provider';
import { User } from '@/features/auth/types/user.types';

const MessagesList = () => {
  const { fleet } = useCurrentFleet();
  const { messages, isLoading } = useMessages();

  const messagesElementRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesElementRef.current) {
      messagesElementRef.current.scrollTo({
        top: messagesElementRef.current.scrollHeight,
        behavior: 'auto',
      });
    }
  }, [messages]);

  function getUserById(userId: string): User | undefined {
    return fleet.members.find((user) => user.id === userId);
  }

  const MessageList = messages.map((message) => (
    <MessageBubble
      user={getUserById(message.authorId)}
      message={message}
      key={message.id}
    />
  ));

  return (
    <div
      ref={messagesElementRef}
      className="flex flex-1 scroll-pt-2.5 flex-col gap-2.5 overflow-y-scroll scroll-smooth rounded-t-[20px] bg-light p-3"
      id="messages-list"
    >
      {isLoading && <IonSpinner className="mx-auto my-0 size-9 text-dark" />}
      {MessageList}
    </div>
  );
};

export default MessagesList;
