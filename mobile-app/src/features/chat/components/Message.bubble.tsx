import { User } from '@/features/auth/types/user.types';
import { Message } from '@/features/chat/chat.types';
import { formatDateToHoursMinutes } from '@/utils/date';
import { getUserDisplayName } from '@/utils/user';

type MessageInListProps = {
  message: Message;
  user?: User;
};

const MessageBubble = ({ message, user }: MessageInListProps) => {
  const { status, createdAt, isMine, content } = message;

  const authorName = user ? getUserDisplayName(user) : 'Inconnu';
  const isPending = status === 'pending';
  const isError = status === 'error';

  return (
    <div
      data-is-mine={isMine}
      className="group/message flex flex-col items-start data-[is-mine=true]:items-end"
    >
      <div className="flex max-w-full flex-col gap-1 rounded-2xl bg-border p-2.5 text-start group-data-[is-mine=true]/message:bg-secondary group-data-[is-mine=true]:text-end group-data-[is-mine=true]/message:text-light">
        <strong>{authorName}</strong>
        <p>{content}</p>
        {isPending && <p>En attente</p>}
        {isError && <p>Erreur</p>}
        {/* Date */}
        <p className="text-xs">
          {formatDateToHoursMinutes(new Date(createdAt))}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
