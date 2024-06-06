/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { IonModal, IonSpinner } from '@ionic/react';

import Button from '@/components/Button/Button.global';
import StationPicker from '@/features/search/components/Station.picker';
import ErrorMessage from '@/components/ErrorMessage/Error.message';
import { useTripSelectionStore } from '@/features/search/stores/trip-selection.store';
import { Station } from '@/features/search/types/station.types';
import { GlobalModalOptions } from '@/types';

const styles = css({
  '--height': 'auto',
  '::part(content)': {
    width: '88%',
    height: 'auto',
    minHeight: '80%',
    backgroundColor: 'white',
    borderRadius: '13px',
  },
  '.ion-page': {
    position: 'absolute',
    padding: 20,
    gap: 20,
  },
  '.header': {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: 22,
    fontWeight: 600,
  },
  '.content': {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'scroll',
  },
  'ion-spinner': {
    margin: 'auto',
    width: '50px',
    height: '50px',
  },
  '.buttonsContainer': {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    button: {
      height: 50,
    },
  },
});

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
  const [resetStations, selectedLine, selectedTransportMode, isFilled] =
    useTripSelectionStore((state) => [
      state.resetStations,
      state.selectedLine,
      state.selectedTransportMode,
      state.isFilled,
    ]);

  return (
    <IonModal
      isOpen={isOpen}
      showBackdrop={true}
      backdropDismiss={true}
      onDidDismiss={onClose}
      css={styles}
      data-cy="stations-modal"
    >
      <h3>
        Stations - {selectedTransportMode.name} - {selectedLine?.name}
      </h3>
      <div className="content">
        {isLoading ? <IonSpinner /> : isError && <ErrorMessage />}
        {data.map((station: Station, index: number) => (
          <StationPicker
            key={station.id}
            index={index}
            isLastStation={data.length === index + 1}
            data={station}
          />
        ))}
      </div>
      <div className="buttonsContainer">
        <Button onClick={resetStations} variant="outline">
          Annuler
        </Button>
        <Button onClick={onClose} disabled={!isFilled()}>
          Valider
        </Button>
      </div>
    </IonModal>
  );
};
