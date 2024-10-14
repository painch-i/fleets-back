import { IonContent, IonHeader, IonPage, IonSpinner } from '@ionic/react';
import { FaPlus, FaRegStar } from 'react-icons/fa';
import { TbSearchOff } from 'react-icons/tb';
import { IoMdSwap } from 'react-icons/io';

import Button from '@/components/Button/Button.global';
import Header from '@/components/Header/Header.global';
import ErrorMessage from '@/components/ErrorMessage/Error.message';
import CreateFleetModal from '@/features/search/components/modals/CreateFleet.modal';
import RefreshOnPull from '@/components/RefreshOnPull/RefreshOnPull.component';
import GenderToggle from '@/features/search/components/Gender.toggle';
import FleetCard from '@/features/fleets/components/Fleet.card';

import { useTripSelectionStore } from '@/features/search/stores/trip-selection.store';
import { useSearchFleets } from '@/features/search/api/use-search-fleets.query';
import useVisibilityState from '@/hooks/use-visibility-state.hook';

// TODO -> Refaire le stick header en plus beau

const EmptyListComponent: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = (props) => (
  <div className="flex flex-col items-center justify-center gap-2.5 text-grey">
    <TbSearchOff className="size-12" color="currentColor" />
    <p>Aucun Fleet ne correspond à tes critères.</p>
    <p>Modifie les filtres ou crée ton propre Fleet.</p>
    <Button className="mt-2.5 w-3/4 rounded-[10px]" {...props}>
      Créer mon fleet
    </Button>
  </div>
);

export const ResultsFleets: React.FC = () => {
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
    history.back();
  };

  const handleOnClickSwap = () => {
    document.getElementById('swap-icon')?.classList.toggle('rotate-[270deg]');
    swapStations();
  };

  const isListResultsEmpty = data.length === 0;

  return (
    <IonPage className="bg-light">
      <IonHeader className="flex w-full flex-col gap-7 rounded-b-[30px] bg-primary p-6 !shadow-md-unblur !shadow-black/25">
        <Header
          onClickIconLeft={handleGoingBack}
          iconRight={FaRegStar}
          className="p-0"
          title=""
        />
        <div className="flex items-center justify-between gap-4 rounded-[10px] border-2 border-solid border-border p-4">
          <div className="flex flex-[2] flex-col justify-between gap-6">
            <div className="flex flex-col gap-0 text-whiteSmoke">
              <p className="text-xs">Station de départ</p>
              <h1 className="text-xl font-bold">{startStation?.name}</h1>
            </div>
            <div className="h-px w-full border border-dashed border-border bg-transparent" />
            <div className="flex flex-col gap-0 text-whiteSmoke">
              <p className="text-xs">Station d'arrivée</p>
              <h1 className="text-xl font-bold">{endStation?.name}</h1>
            </div>
          </div>
          <div
            className="flex size-12 items-center justify-center rounded-2xl bg-whiteSmoke p-2.5"
            onClick={handleOnClickSwap}
          >
            <IoMdSwap
              className="size-6 rotate-90 transition-transform duration-200 ease-linear"
              id="swap-icon"
            />
          </div>
        </div>
        <GenderToggle />
      </IonHeader>
      <IonContent className="part-[background]:bg-light part-[scroll]:pt-0">
        <RefreshOnPull onRefresh={handleRefreshSearch} />
        <div className="relative flex min-h-[30%] flex-col items-center gap-[30px] px-6 pb-[100px] pt-8">
          {isPending ? (
            <IonSpinner className="absolute left-2/4 top-[55%] size-[50px] -translate-y-2/4 translate-x-[-55%]" />
          ) : isError ? (
            <ErrorMessage />
          ) : (
            isListResultsEmpty && <EmptyListComponent onClick={open} />
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
        <div
          aria-disabled={isListResultsEmpty}
          className="fixed bottom-5 right-5 flex size-12 items-center justify-center rounded-2xl bg-primary text-white shadow-md-unblur shadow-black/25 aria-disabled:invisible"
          onClick={open}
        >
          <FaPlus className="size-5" color="currentColor" />
        </div>
        <CreateFleetModal isOpen={isOpen} onClose={close} />
      </IonContent>
    </IonPage>
  );
};
