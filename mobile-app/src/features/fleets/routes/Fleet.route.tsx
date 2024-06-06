/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { Fragment } from 'react';
import { IonContent, IonHeader, IonPage, useIonRouter } from '@ionic/react';

import Skeleton from '@/components/Skeleton/Skeleton.text';
import { StationsLine } from '@/components/StationsLine/Stations.line';
import RefreshOnPull from '@/components/RefreshOnPull/RefreshOnPull.component';
import GeolocationHandler from '@/features/fleets/components/Geolocation.handler';
import FleetHeader from '@/features/fleets/components/Fleet.header';
import MemberSimpleProfile from '@/features/fleets/components/Member.simple-profile';
import { useCurrentFleet } from '@/features/fleets/providers/current-fleet.provider';
import { colors } from '@/styles';

const styles = css({
  background: colors.primary,
  color: colors.dark,
  '.scrollable-container': {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflowY: 'auto',
    paddingTop: 'max(35px, var(--ion-safe-area-top))',
  },
  'ion-content::part(background)': {
    background: 'transparent',
  },
  'ion-content::part(scroll)': {
    paddingTop: 0,
    overflow: 'visible',
  },
  '.content': {
    flex: 1,
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
    padding: 25,
    gap: 25,
    backgroundColor: colors.light,
    '& > h3,.title-container > h3': {
      fontSize: 26,
      color: colors.dark,
      fontWeight: 'bold',
    },
    '& > .title-container': {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      '& > span': {
        color: colors.label,
        fontSize: 14,
        fontWeight: 'bold',
      },
    },
    '& > .members-container': {
      // TODO -> En faire une row scrollable vers la droite donc faut gérer le padding
      display: 'flex',
      flexDirection: 'row',
      gap: 25,
      '& > .member-skeleton': {
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
      },
    },
  },
});

// TODO -> En faire un composant global avec le choix de mettre l'heure (en dessous de la station de départ) + de mettre la barre à gauche ou à droite + OnClick?
const stylesTrajet = css({
  display: 'flex',
  height: 150,
  width: '100%',
  flexDirection: 'row',
  padding: 25,
  gap: 20,
  alignItems: 'center',
  justifyContent: 'space-between',
  border: `2px solid ${colors.whiteSmoke}`,
  borderRadius: 20,
  '.route-infos': {
    flex: 2,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    '& > p': {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.dark,
    },
    '& > .route-separator': {
      height: 3,
      width: '100%',
      backgroundColor: colors.whiteSmoke,
    },
  },
});

export const FleetPage: React.FC = () => {
  const router = useIonRouter();
  const { fleet, invalidateCurrentFleetQuery } = useCurrentFleet();

  function handleGoingToMembersPage(): void {
    router.push('/fleet/request');
  }

  async function handleRefreshPull(): Promise<void> {
    invalidateCurrentFleetQuery();

    return new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return (
    <IonPage css={styles}>
      <div className="scrollable-container">
        <IonHeader>
          <FleetHeader />
        </IonHeader>
        <IonContent scrollY={false}>
          <RefreshOnPull onRefresh={handleRefreshPull} color={colors.light} />
          <div className="content">
            <GeolocationHandler />
            <h3>Trajet</h3>
            {/* TODO -> TransportIcon -> Améliorer la gestion de la taille pour que une taille à 25px fonctionne */}
            {/* <TransportIcon line={fleet.line} size="25px" /> */}
            {/* TODO -> Ici mettre skeleton de la même taille */}
            <div css={stylesTrajet}>
              <StationsLine />
              <div className="route-infos">
                <p>{fleet.startStation.name}</p>
                <div className="route-separator" />
                <p>{fleet.endStation.name}</p>
              </div>
            </div>
            <div className="title-container">
              <h3>Membres {`(${fleet.members.length})`}</h3>
              <span onClick={handleGoingToMembersPage}>Voir plus</span>
            </div>
            <div className="members-container">
              {fleet.members ? (
                fleet.members.map((member) => (
                  <MemberSimpleProfile member={member} key={member.id} />
                ))
              ) : (
                <Fragment>
                  <div className="member-skeleton">
                    <Skeleton h={60} w={60} radius="100%" />
                    <Skeleton h={8} />
                  </div>
                  <div className="member-skeleton">
                    <Skeleton h={60} w={60} radius="100%" />
                    <Skeleton h={8} />
                  </div>
                  <div className="member-skeleton">
                    <Skeleton h={60} w={60} radius="100%" />
                    <Skeleton h={8} />
                  </div>
                </Fragment>
              )}
            </div>
          </div>
        </IonContent>
      </div>
    </IonPage>
  );
};
