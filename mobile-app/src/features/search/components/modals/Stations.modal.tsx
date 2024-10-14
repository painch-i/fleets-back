import { IonModal, IonSpinner } from '@ionic/react';

import Button from '@/components/Button/Button.global';
import ErrorMessage from '@/components/ErrorMessage/Error.message';
import StationPicker from '@/features/search/components/Station.picker';

import { useTripSelectionStore } from '@/features/search/stores/trip-selection.store';

import { Station } from '@/features/search/types/station.types';
import { GlobalModalOptions } from '@/types';

type StationsModal = GlobalModalOptions & {
  data: Station[];
  isLoading: boolean;
  isError: boolean;
};

export const StationsModal: React.FC<StationsModal> = ({
  isOpen,
  onClose,
  isLoading,
  isError,
  data,
}) => {
  const [resetStations, isFilled] = useTripSelectionStore((state) => [
    state.resetStations,
    state.isFilled,
  ]);

  return (
    <IonModal
      isOpen={isOpen}
      showBackdrop
      onDidDismiss={onClose}
      className="part-[content]:size-4/5 part-[content]:rounded-[13px] part-[content]:bg-white part-[content]:p-5"
      data-cy="stations-modal"
    >
      <div className="flex flex-col gap-5 overflow-hidden">
        <h1 className="text-xl">Stations</h1>
        <div className="flex h-full flex-col overflow-x-scroll rounded-xl bg-light p-1">
          {isLoading ? (
            <IonSpinner className="m-auto size-12" />
          ) : (
            isError && <ErrorMessage />
          )}
          {data.map((station: Station, index: number) => (
            <StationPicker
              key={station.id}
              index={index}
              isLastStation={data.length === index + 1}
              data={station}
            />
          ))}
        </div>
        <div className="flex w-full justify-between gap-5">
          <Button onClick={resetStations} variant="outline">
            Réinitialiser
          </Button>
          <Button onClick={onClose} disabled={!isFilled()}>
            Valider
          </Button>
        </div>
      </div>
    </IonModal>
  );
};
