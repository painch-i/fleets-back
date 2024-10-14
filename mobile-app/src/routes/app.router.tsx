import { ReactElement } from 'react';

import SplashScreen from '@/components/Splashscreen/Splashscreen.component';
import { useCurrentUserQuery } from '@/features/auth/api/use-current-user.query';

import { AccountCreationRouter } from '@/features/auth/routes/account-creation.router';
import { AuthRouter } from '@/features/auth/routes/auth.router';
import { AuthenticatedRouter } from '@/routes/authenticated.router';
import { BrowserRouter } from 'react-router-dom';

export const AppRouter: React.FC = () => (
  <BrowserRouter>
    <BaseRouter />
  </BrowserRouter>
);

const BaseRouter = () => {
  const { data: user, isPending: isUserLoading } = useCurrentUserQuery();
  const routers: ReactElement[] = [];

  if (user) {
    const { isOnboarded } = user;

    if (isOnboarded) {
      routers.push(
        <AuthenticatedRouter key="authenticated-router" user={user} />,
      );
    } else {
      routers.push(
        <AccountCreationRouter user={user} key="account-creation-router" />,
      );
    }
  } else if (!isUserLoading) {
    routers.push(<AuthRouter key="auth-router" />);
  }

  if (routers.length === 0) {
    return <SplashScreen />;
  }

  return <>{routers}</>;
};
