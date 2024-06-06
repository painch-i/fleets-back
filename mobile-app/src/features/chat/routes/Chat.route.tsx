/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { IonContent, IonPage } from '@ionic/react';

import { useCurrentFleet } from '@/features/fleets/providers/current-fleet.provider';
import { useCurrentUser } from '@/features/auth/providers/current-user.provider';
import { MessagesProvider } from '@/features/chat/messages.provider';
import ChatHeader from '@/features/chat/components/Chat.header';
import MessageComposer from '@/features/chat/components/Message.composer';
import MessagesList from '@/features/chat/components/Messages.list';
import { colors } from '@/styles';

const styles = css({
  '::part(background)': {
    background: colors.primary,
  },
  '::part(scroll)': {
    display: 'flex',
    flexDirection: 'column',
  },
});

export const ChatPage: React.FC = () => {
  const { user } = useCurrentUser();
  const { fleet } = useCurrentFleet();

  return (
    <IonPage>
      <IonContent css={styles}>
        <ChatHeader />
        <MessagesProvider fleetId={fleet.id} userId={user.id}>
          <MessagesList />
          <MessageComposer />
        </MessagesProvider>
      </IonContent>
    </IonPage>
  );
};
