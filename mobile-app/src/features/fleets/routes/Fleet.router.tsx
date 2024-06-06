import { Redirect, Route, Switch } from 'react-router';

import { IonRouterOutlet } from '@ionic/react';

import { ChatPage } from '@/features/chat/routes/Chat.route';
import { CurrentFleetProvider } from '@/features/fleets/providers/current-fleet.provider';
import Members from '@/features/fleets/routes/Members.route';
import { Fleet } from '@/features/fleets/types/fleet.types';
import { FleetPage } from '@/features/fleets/routes/Fleet.route';

type FleetRouterProps = {
  fleet: Fleet;
  isFetching: boolean;
};

export const FleetRouter = ({ fleet, isFetching }: FleetRouterProps) => (
  <CurrentFleetProvider fleet={fleet} isFetching={isFetching}>
    <IonRouterOutlet id="fleet-router">
      <Switch>
        <Route exact path="/fleet" component={FleetPage} />
        <Route exact path="/fleet/chat" component={ChatPage} />
        <Route exact path="/fleet/request" component={Members} />
        <Redirect to="/fleet" />
      </Switch>
    </IonRouterOutlet>
  </CurrentFleetProvider>
);
