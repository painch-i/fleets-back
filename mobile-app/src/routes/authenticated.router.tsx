import { ReactElement } from 'react';
import { Redirect, Route, Switch } from 'react-router';

import { CurrentUserProvider } from '@/features/auth/providers/current-user.provider';
import { ResultsFleets } from '@/features/search/routes/ResultsFleets.route';
import { FleetRouter } from '@/features/fleets/routes/Fleet.router';
import { TabsRouter } from '@/routes/tabs.router';

import { User } from '@/features/auth/types/user.types';
import { Fleet } from '@/features/fleets/types/fleet.types';
import { useCurrentFleetQuery } from '@/features/fleets/api/current-fleet.query';
import SplashScreen from '@/components/Splashscreen/Splashscreen.component';

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

  if (fleet) {
    // Ici je passe en props le fleet obligatoire, de sorte que toutes les pages du routeur aient accès à ce fleet
    routes.push(
      <Route
        key={`fleets/${fleet.id}`}
        path="/fleet"
        render={() => <FleetRouter fleet={fleet} isFetching={isFetching} />}
      />,
      <Redirect key={`fleets/${fleet.id}/redirect`} path="/" to="/fleet" />,
    );
  }

  if (routes.length === 0) {
    routes.push(
      <Route
        key="results-fleets"
        exact
        path="/results-fleets"
        component={ResultsFleets}
      />,
      <Route key="tabs" path="/tabs" component={TabsRouter} />,
      <Redirect key="redirect" path="/" to="/tabs" />,
    );
  }

  return (
    <CurrentUserProvider user={user}>
      <Switch>{routes}</Switch>
    </CurrentUserProvider>
  );
};
