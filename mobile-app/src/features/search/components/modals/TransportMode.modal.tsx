/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { IonModal, IonSpinner } from '@ionic/react';

import { colors } from '@/styles';
import { useTripSelectionStore } from '@/features/search/stores/trip-selection.store';
import { TransportIcon } from '@/components/TransportIcon/Transport.icon';
import ErrorMessage from '@/components/ErrorMessage/Error.message';
import {
  TransportModeItem,
  transportModes,
} from '@/features/search/types/transport.types';
import { LinesByModes, Line } from '@/features/search/types/line.types';
import { GlobalModalOptions } from '@/types';

const styles = css({
  '--height': 'auto',
  '--max-height': '65%',
  '--width': '88%',
  '--background': 'white',
  '--border-radius': '13px',
  '--overflow': 'hidden',
  '::part(content)': {
    display: 'flex',
  },
  '.ion-page': {
    width: '100%',
    height: 'auto',
    gap: '20px',
    padding: '20px',
    overflow: 'hidden',
  },
  '.header': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: '30px',
  },
  '.roundIcon': {
    backgroundColor: colors.border,
    borderRadius: '15px',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    p: {
      textTransform: 'capitalize',
      fontSize: 10,
      fontWeight: 'bold',
    },
  },
  '.active': {
    backgroundColor: colors.secondary,
  },
  '.content': {
    flex: 1,
    minHeight: '200px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
    gap: '15px',
    padding: '10px',
    borderRadius: '10px',
    backgroundColor: colors.light,
    overflowY: 'auto',
    position: 'relative',
    '& ion-spinner': {
      position: 'absolute',
      left: '42%',
      alignSelf: 'center',
      width: '60px',
      height: '60px',
    },
    '& > .ErrorMessage': {
      position: 'absolute',
      width: '95%',
      left: '50%',
      top: '40%',
      transform: 'translate(-50%, -40%)',
    },
  },
  '.largerIcon': {
    borderRadius: '10px',
  },
});

interface TransportModeModalOptions extends GlobalModalOptions {
  linesByMode: LinesByModes | undefined;
  isLoading: boolean;
  isError: boolean;
}

export const TransportModeModal: React.FC<TransportModeModalOptions> = ({
  linesByMode,
  isLoading,
  isError,
  isOpen,
  onClose,
}) => {
  const [selectedTransportMode, updateFleet, resetStations] =
    useTripSelectionStore((state) => [
      state.selectedTransportMode,
      state.updateFleet,
      state.resetStations,
    ]);

  function handleLineSelection(line: Line): void {
    updateFleet({ selectedLine: line });
    resetStations();
    onClose();
  }

  function handleChangeTransportMode(transportMode: TransportModeItem): void {
    updateFleet({ selectedTransportMode: transportMode });
  }

  const transportModeItems: JSX.Element[] = transportModes.map(
    (item: TransportModeItem, index: number) => (
      <div
        className={`roundIcon ${
          selectedTransportMode.subname === item.subname && 'active'
        }`}
        onClick={() => handleChangeTransportMode(item)}
        key={index}
      >
        <item.icon size={'20px'} />
        <p>{item.name}</p>
      </div>
    ),
  );

  const linesBySelectedMode = !linesByMode
    ? []
    : linesByMode[selectedTransportMode.subname];

  const transportLinesItems: JSX.Element[] = linesBySelectedMode.map(
    (line: Line) => (
      <TransportIcon
        line={line}
        action={() => handleLineSelection(line)}
        key={line.externalId}
      />
    ),
  );

  return (
    <IonModal
      isOpen={isOpen}
      showBackdrop={true}
      backdropDismiss={true}
      onDidDismiss={onClose}
      css={styles}
      data-cy="transport-mode-modal"
    >
      <div className="header">{transportModeItems}</div>
      <div className="content">
        {isLoading ? (
          <IonSpinner />
        ) : isError ? (
          <ErrorMessage message="Erreur lors de la récupération des lignes" />
        ) : (
          transportLinesItems
        )}
      </div>
    </IonModal>
  );
};
