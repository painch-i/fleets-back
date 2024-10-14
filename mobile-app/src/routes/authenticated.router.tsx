import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router';

import { CurrentUserProvider } from '@/features/auth/providers/current-user.provider';
import { FleetRouter } from '@/features/fleets/routes/Fleet.router';
import { ResultsFleets } from '@/features/search/routes/ResultsFleets.route';

import SplashScreen from '@/components/Splashscreen/Splashscreen.component';
import { User } from '@/features/auth/types/user.types';
import { useCurrentFleetQuery } from '@/features/fleets/api/current-fleet.query';
import { Fleet } from '@/features/fleets/types/fleet.types';
import { History } from '@/features/history/routes/History.route';
import { NotificationsProvider } from '@/features/notifications/notifications.provider';
import { Profile } from '@/features/profile/routes/Profile.route';
import { SearchFleets } from '@/features/search/routes/SearchFleets.route';
import { TabsLayout } from '@/routes/tabs.layout';

type AuthRouterProps = {
  fleet?: Fleet;
  user: User;
};

export const AuthenticatedRouter = ({ user }: AuthRouterProps) => {
  const { data: fleet, isPending, isFetching } = useCurrentFleetQuery();
  const routes: ReactElement[] = [];

  if (isPending) {
    return <SplashScreen />;
  }

  // Lorsque l'utilisateur a un fleet, il est redirigé vers la page de fleet
  if (fleet) {
    // Ici je passe en props le fleet obligatoire, de sorte que toutes les pages du routeur aient accès à ce fleet
    routes.push(
      <Route
        key={`fleets/${fleet.id}`}
        path="/fleet/*"
        element={<FleetRouter fleet={fleet} isFetching={isFetching} />}
      />,
      <Route
        key={`fleets/${fleet.id}/redirect/`}
        path="/*"
        element={<Navigate to="/fleet" replace />}
      />,
    );
  }

  // Si l'utilisateur n'a pas de fleet, il a accès à toutes les pages de l'application
  if (routes.length === 0) {
    routes.push(
      <Route
        key="results-fleets"
        path="/results-fleets"
        Component={ResultsFleets}
      />,
      <Route path="/tabs/*" Component={TabsLayout} key="tabs-routes">
        <Route path="search" Component={SearchFleets} />
        <Route path="profile" Component={Profile} />
        <Route path="history" Component={History} />
        <Route path="*" Component={() => <Navigate to="/tabs/search" />} />
      </Route>,
      <Route key="redirect" path="/*" element={<Navigate to="/tabs" />} />,
    );
  }

  return (
    <CurrentUserProvider user={user}>
      <NotificationsProvider>
        <Routes>{routes}</Routes>
      </NotificationsProvider>
    </CurrentUserProvider>
  );
};
