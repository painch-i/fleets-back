import { IonContent, IonHeader, IonPage } from '@ionic/react';
import { useNavigate } from 'react-router';
import { Fragment } from 'react';

import RefreshOnPull from '@/components/RefreshOnPull/RefreshOnPull.component';
import Skeleton from '@/components/Skeleton/Skeleton.text';
import { StationsLine } from '@/components/StationsLine/Stations.line';
import LinesRow from '@/components/Line/Lines.row';
import FleetHeader from '@/features/fleets/components/Fleet.header';
import GeolocationHandler from '@/features/fleets/components/Geolocation.handler';
import MemberSimpleProfile from '@/features/fleets/components/Member.simple-profile';
import { useCurrentFleet } from '@/features/fleets/providers/current-fleet.provider';
import { colors } from '@/styles';

export const FleetPage: React.FC = () => {
  const navigate = useNavigate();
  const { fleet, invalidateCurrentFleetQuery } = useCurrentFleet();

  function handleGoingToMembersPage(): void {
    navigate('/fleet/request');
  }

  async function handleRefreshPull(): Promise<void> {
    invalidateCurrentFleetQuery();

    return new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return (
    <IonPage className="bg-primary text-dark">
      <div className="flex h-screen flex-col overflow-y-auto pt-[max(35px,var(--ion-safe-area-top))]">
        <IonHeader>
          <FleetHeader />
        </IonHeader>
        <IonContent
          className="part-[scroll]:overflow-visible part-[background]:bg-transparent part-[scroll]:pt-0"
          scrollY={false}
        >
          <RefreshOnPull onRefresh={handleRefreshPull} color={colors.light} />
          <div className="flex min-h-full flex-1 flex-col gap-6 rounded-t-[20px] bg-light p-6 text-dark">
            <GeolocationHandler />
            <div className="flex w-full items-center gap-1.5">
              <h3 className="text-center text-[26px] font-bold">Trajet</h3>
              <LinesRow
                className="border-none"
                lines={fleet.linesTaken}
                disabled
              />
            </div>
            {/* TODO -> Ici mettre skeleton de la même taille */}
            {/* TODO -> En faire un composant global avec le choix de mettre l'heure (en dessous de la station de départ) + de mettre la barre à gauche ou à droite + OnClick? */}
            <div className="flex h-36 w-full items-center justify-between gap-5 rounded-[20px] border-2 border-solid border-whiteSmoke p-6">
              <StationsLine />
              <div className="flex h-full flex-[2] flex-col justify-between">
                <p className="text-base font-bold">{fleet.startStation.name}</p>
                <div className="h-[3px] w-full bg-whiteSmoke" />
                <p className="text-base font-bold">{fleet.endStation.name}</p>
              </div>
            </div>
            <div className="flex w-full items-center justify-between">
              <h3 className="text-[26px] font-bold">
                Membres {`(${fleet.members.length})`}
              </h3>
              <span
                className="text-sm font-bold text-label"
                onClick={handleGoingToMembersPage}
              >
                Voir plus
              </span>
            </div>
            {/* TODO -> En faire une row scrollable vers la droite donc faut gérer le padding */}
            <div className="flex gap-6">
              {fleet.members ? (
                fleet.members.map((member) => (
                  <MemberSimpleProfile member={member} key={member.id} />
                ))
              ) : (
                <Fragment>
                  <div className="flex flex-col gap-1">
                    <Skeleton className="size-[60px] rounded-full" />
                    <Skeleton className="h-2" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Skeleton className="size-[60px] rounded-full" />
                    <Skeleton className="h-2" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Skeleton className="size-[60px] rounded-full" />
                    <Skeleton className="h-2" />
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
