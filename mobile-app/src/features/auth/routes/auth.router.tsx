import { Redirect, Route, Switch } from 'react-router';

import Login from '@/features/auth/routes/Login.route';
import Register from '@/features/auth/routes/Register.route';
import OnBoarding from '@/features/auth/routes/OnBoarding.route';

export const AuthRouter: React.FC = () => (
  <Switch>
    <Route path="/onBoarding" component={OnBoarding} />
    <Route path="/login" component={Login} />
    <Route path="/register" component={Register} />

    <Redirect to="/onBoarding" />
  </Switch>
);
