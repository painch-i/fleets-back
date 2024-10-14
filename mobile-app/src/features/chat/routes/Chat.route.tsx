import { IonContent, IonPage } from '@ionic/react';
import { useNavigate } from 'react-router';

import { useCurrentFleet } from '@/features/fleets/providers/current-fleet.provider';
import { useCurrentUser } from '@/features/auth/providers/current-user.provider';
import { MessagesProvider } from '@/features/chat/messages.provider';
import MessageComposer from '@/features/chat/components/Message.composer';
import MessagesList from '@/features/chat/components/Messages.list';
import Header from '@/components/Header/Header.global';

export const ChatPage: React.FC = () => {
  const { user } = useCurrentUser();
  const { fleet } = useCurrentFleet();

  const navigate = useNavigate();

  function handleGoingBack(): void {
    if (history.length > 2) {
      history.back();
      return;
    }
    navigate('/tabs/search');
  }

  return (
    <IonPage>
      <IonContent className="part-[scroll]:flex part-[scroll]:flex-col part-[background]:bg-primary">
        <Header title="Messagerie" onClickIconLeft={handleGoingBack} />
        <MessagesProvider fleetId={fleet.id} userId={user.id}>
          <MessagesList />
          <MessageComposer />
        </MessagesProvider>
      </IonContent>
    </IonPage>
  );
};
