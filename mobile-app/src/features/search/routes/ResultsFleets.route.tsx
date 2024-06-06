/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonSpinner,
  useIonRouter,
} from '@ionic/react';
import {
  FaChevronLeft,
  FaExchangeAlt,
  FaPlus,
  FaRegStar,
} from 'react-icons/fa';
import { TbSearchOff } from 'react-icons/tb';

import RefreshOnPull from '@/components/RefreshOnPull/RefreshOnPull.component';
import { FleetCard } from '@/features/fleets/components/Fleet.card';
import GenderToggle from '@/features/search/components/Gender.toggle';
import { useTripSelectionStore } from '@/features/search/stores/trip-selection.store';
import useVisibilityState from '@/hooks/use-visibility-state.hook';

import Button from '@/components/Button/Button.global';
import ErrorMessage from '@/components/ErrorMessage/Error.message';
import { useSearchFleets } from '@/features/search/api/use-search-fleets.query';
import { CreateFleetModal } from '@/features/search/components/modals/CreateFleet.modal';
import { colors } from '@/styles';

// TODO -> Refaire le stick header en plus beau

const styles = css({
  '--ion-safe-area-top': 0,
  '--ion-background-color': 'transparent',
  'ion-header': {
    width: '100%',
    backgroundColor: colors.primary,
    borderBottomLeftRadius: '30px',
    borderBottomRightRadius: '30px',
    boxShadow: '0 4px 10px 0px rgba(0, 0, 0, 0.25)',
  },
  '.icons-header': {
    position: 'sticky',
    top: 0,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 25,
    paddingTop: 'max(35px, env(safe-area-inset-top, 0))',
    zIndex: 100,
    '& svg:first-of-type': {
      marginLeft: '-5px',
    },
  },
  '.background-header': {
    width: '100%',
    padding: '5px 25px 25px',
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  '.informationsContainer': {
    display: 'flex',
    flexDirection: 'row',
    padding: '16px',
    borderRadius: '13px',
    border: `1px solid ${colors.border}`,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  '.informationsContent': {
    flex: 2,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginRight: '15px',
  },
  '.informationsTextContainer': {
    display: 'flex',
    flexDirection: 'column',
    color: colors.whiteSmoke,
    gap: 0,
    '& h1': {
      fontSize: '20px',
      fontWeight: 'bold',
    },
    '& p': {
      fontSize: '12px',
    },
  },
  '.informationsDivider': {
    width: '100%',
    height: '1px',
    border: `1px dashed ${colors.border}`,
    backgroundColor: 'transparent',
    margin: '25px 0',
  },
  '.buttonSwap': {
    width: '50px',
    height: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px',
    borderRadius: '15px',
    backgroundColor: colors.whiteSmoke,
    '& svg': {
      transition: 'transform 0.2s linear',
      transform: 'rotate(90deg)',
    },
    '.rotate': {
      transform: 'rotate(270deg)',
    },
  },
  '.content': {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '30%',
    gap: '30px',
    padding: '25px 25px 100px',
    alignItems: 'center',
    '& > ion-spinner': {
      position: 'absolute',
      top: '55%',
      left: '50%',
      transform: 'translate(-55%, -50%)',
      width: '50px',
      height: '50px',
    },
  },
  '.emptyContainer': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    color: colors.grey,
    '& > button': {
      width: '70%',
      borderRadius: 10,
      marginTop: 10,
    },
  },
  '.addButton': {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    height: '50px',
    width: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '20px',
    backgroundColor: colors.primary,
    boxShadow: '0 4px 10px 0px rgba(0, 0, 0, 0.25)',
  },
});

export const ResultsFleets: React.FC = () => {
  const router = useIonRouter();

  const [
    startStation,
    endStation,
    departureTime,
    genderConstraint,
    swapStations,
  ] = useTripSelectionStore((state) => [
    state.startStation,
    state.endStation,
    state.departureTime,
    state.genderConstraint,
    state.swapStations,
  ]);

  const {
    isPending,
    data = [],
    isError,
    refetch,
  } = useSearchFleets({
    startStationId: startStation?.id,
    endStationId: endStation?.id,
    departureTime: departureTime.toISOString(),
    genderConstraint,
  });

  const { isOpen, open, close } = useVisibilityState(false);

  async function handleRefreshSearch(): Promise<void> {
    await refetch();
  }

  const handleGoingBack = () => {
    router.goBack();
  };

  const handleOnClickSwap = () => {
    document.getElementById('swap-icon')?.classList.toggle('rotate');
    swapStations();
  };

  const isListResultsEmpty = data.length === 0;

  const EmptyListComponent = () => (
    <div className="emptyContainer">
      <TbSearchOff size={50} color={colors.grey} />
      <p>Aucun Fleet ne correspond à tes critères.</p>
      <p>Modifie les filtres ou crée ton propre Fleet.</p>
      <Button onClick={open}>Créer mon fleet</Button>
    </div>
  );

  return (
    <IonPage css={styles}>
      <IonHeader>
        <div className="icons-header">
          <FaChevronLeft size={25} color="white" onClick={handleGoingBack} />
          <FaRegStar size={31} color="white" />
        </div>
        <div className="background-header">
          <div className="informationsContainer">
            <div className="informationsContent">
              <div className="informationsTextContainer">
                <p>Station de départ</p>
                <h1>{startStation?.name}</h1>
              </div>
              <div className="informationsDivider" />
              <div className="informationsTextContainer">
                <p>Station d'arrivée</p>
                <h1>{endStation?.name}</h1>
              </div>
            </div>
            {/* { TODO -> Changer l'icon pour un meilleur truc } */}
            <div className="buttonSwap" onClick={handleOnClickSwap}>
              <FaExchangeAlt size={20} id="swap-icon" />
            </div>
          </div>
          <GenderToggle />
        </div>
      </IonHeader>
      <IonContent>
        <RefreshOnPull onRefresh={handleRefreshSearch} />
        <div className="content">
          {isPending ? (
            <IonSpinner />
          ) : isError ? (
            <ErrorMessage />
          ) : (
            isListResultsEmpty && <EmptyListComponent />
          )}

          {data.map((item, index) => (
            <FleetCard
              data={item}
              startStationName={startStation!.name}
              endStationName={endStation!.name}
              key={index}
            />
          ))}
        </div>
        {!isListResultsEmpty && (
          <div className="addButton" onClick={open}>
            <FaPlus size={22} color="white" />
          </div>
        )}
        <CreateFleetModal isOpen={isOpen} onClose={close} />
      </IonContent>
    </IonPage>
  );
};
