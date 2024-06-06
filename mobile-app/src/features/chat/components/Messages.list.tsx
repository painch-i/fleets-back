/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import React, { useEffect } from 'react';

import MessageBubble from '@/features/chat/components/Message.bubble';
import { useMessages } from '@/features/chat/messages.provider';
import { colors } from '@/styles';
import { IonSpinner } from '@ionic/react';
import { useCurrentFleet } from '@/features/fleets/providers/current-fleet.provider';
import { User } from '@/features/auth/types/user.types';

const styles = css({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  borderTopLeftRadius: '20px',
  borderTopRightRadius: '20px',
  padding: 12,
  backgroundColor: colors.light,
  overflowY: 'scroll',
  scrollBehavior: 'smooth',
  scrollPaddingTop: 10,
  '& > ion-spinner': {
    margin: '0 auto',
    '--color': colors.dark,
    height: 35,
    width: 35,
  },
});

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
    <div ref={messagesElementRef} css={styles} id="messages-list">
      {isLoading && <IonSpinner />}
      {MessageList}
    </div>
  );
};

export default MessagesList;
