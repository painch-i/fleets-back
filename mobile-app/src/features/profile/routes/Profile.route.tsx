import { IonButton } from '@ionic/react';

import { authStore } from '@/features/auth/stores/auth.store';
import { useEventSocket } from '@/providers/event-socket.provider';

export const Profile: React.FC = () => {
  const removeToken = authStore((state) => state.removeToken);
  const { logout: logoutFromSocket } = useEventSocket();
  const onClick = () => {
    removeToken();
    logoutFromSocket();
  };
  return (
    <IonButton onClick={onClick} color="danger">
      Log out
    </IonButton>
  );
};
