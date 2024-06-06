/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';

import { User } from '@/features/auth/types/user.types';
import { Message } from '@/features/chat/chat.types';
import { formatDateToHoursMinutes } from '@/utils/date';
import { getUserDisplayName } from '@/utils/user';
import { colors } from '@/styles';

const styles = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  '&[data-is-mine]': {
    alignItems: 'flex-end',
    '.message-content': {
      color: colors.light,
      backgroundColor: colors.secondary,
      padding: 10,
      textAlign: 'end',
    },
  },
  '& > .message-content': {
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'start',
    backgroundColor: colors.border,
    padding: 10,
    borderRadius: 16,
    gap: 5,
  },
  '& > .message-content__date': {
    fontSize: '0.7rem',
  },
});

type MessageInListProps = {
  message: Message;
  user?: User;
};

const MessageBubble = ({ message, user }: MessageInListProps) => {
  const { status, createdAt, isMine, content } = message;

  const authorName = getUserDisplayName(user?.email || '');
  const isPending = status === 'pending';
  const isError = status === 'error';
  const isMineProps = isMine ? { 'data-is-mine': '' } : {};

  return (
    <div css={styles} {...isMineProps}>
      <div className="message-content">
        <strong className="message-content__author">{authorName}</strong>
        <p className="message-content__message">{content}</p>
        {isPending && <p>En attente</p>}
        {isError && <p>Erreur</p>}
        {/* Date */}
        <p className="message-content__date">
          {formatDateToHoursMinutes(new Date(createdAt))}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
