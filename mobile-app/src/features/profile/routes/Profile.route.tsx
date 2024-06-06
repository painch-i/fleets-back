/** @jsxImportSource @emotion/react */

import { authStore } from '@/features/auth/stores/auth.store';
import { useEventSocket } from '@/providers/event-socket.provider';
import { IonButton, IonContent, IonPage } from '@ionic/react';

export const Profile: React.FC = () => {
  const removeToken = authStore((state) => state.removeToken);
  const { logout: logoutFromSocket } = useEventSocket();
  const onClick = () => {
    removeToken();
    logoutFromSocket();
  };
  return (
    <IonPage>
      <IonContent>
        <IonButton onClick={onClick} color="danger">
          Log out
        </IonButton>
      </IonContent>
    </IonPage>
  );
};
