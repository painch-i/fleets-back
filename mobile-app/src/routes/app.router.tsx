import { ReactElement } from 'react';
import { IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import SplashScreen from '@/components/Splashscreen/Splashscreen.component';
import { useCurrentUserQuery } from '@/features/auth/api/use-current-user.query';
import { AuthRouter } from '@/features/auth/routes/auth.router';
import { AuthenticatedRouter } from '@/routes/authenticated.router';

export const AppRouter: React.FC = () => (
  <IonReactRouter>
    <IonRouterOutlet id="app-router">
      <BaseRouter />
    </IonRouterOutlet>
  </IonReactRouter>
);

const BaseRouter = () => {
  const { data: user, isPending: isUserLoading } = useCurrentUserQuery();
  const routers: ReactElement[] = [];

  // S'il y a un user, on affiche le routeur authentifié
  if (user) {
    // Ici j'utilise un props pour que les query dont a besoin le routing soient faites le plus tôt possible
    routers.push(
      <AuthenticatedRouter key="authenticated-router" user={user} />,
    );
    // S'il n'y a pas de user et pas en raison d'un chargement, on affiche le routeur d'authentification
  } else if (!isUserLoading) {
    routers.push(<AuthRouter key="auth-router" />);
  }

  if (routers.length === 0) {
    return <SplashScreen />;
  }

  return <>{routers}</>;
};
