/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { FaRegSun, FaSearch, FaUsers } from 'react-icons/fa';
import {
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { Redirect, Route, Switch } from 'react-router';

import { Profile } from '@/features/profile/routes/Profile.route';
import { History } from '@/features/history/routes/History.route';
import { SearchFleets } from '@/features/search/routes/SearchFleets.route';

import { colors } from '@/styles';

const styles = css({
  'ion-tab-bar': {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderRadius: '20px 20px 0 0',
    '--background': 'white',
    '--border': 'none',
    boxShadow: '0 4px 10px 0px rgba(0, 0, 0, 0.25)',
  },
  'ion-tab-button': {
    '--color': colors.border,
    '--color-selected': colors.primary,
  },
});

export const TabsRouter: React.FC = () => (
  <IonTabs css={styles}>
    <IonRouterOutlet id="main-tabs">
      <Switch>
        <Route exact path="/tabs/search" component={SearchFleets} />
        <Route exact path="/tabs/profile" component={Profile} />
        <Route exact path="/tabs/history" component={History} />

        <Redirect to="/tabs/search" />
      </Switch>
    </IonRouterOutlet>

    <IonTabBar slot="bottom">
      <IonTabButton tab="search" href="/tabs/search">
        <FaSearch size={20} />
      </IonTabButton>
      <IonTabButton tab="history" href="/tabs/history">
        <FaUsers size={20} />
      </IonTabButton>
      <IonTabButton tab="profile" href="/tabs/profile">
        <FaRegSun size={20} />
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);
