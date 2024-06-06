/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';

import { StationsLine } from '@/components/StationsLine/Stations.line';
import { useTripSelectionStore } from '@/features/search/stores/trip-selection.store';
import { colors } from '@/styles';

const styles = css({
  position: 'relative',
  width: '100%',
  height: '130px',
  padding: '16px',
  display: 'flex',
  flexDirection: 'row',
  borderRadius: '13px',
  border: `1px solid ${colors.border}`,
  alignItems: 'center',
  justifyContent: 'space-between',
  overflow: 'hidden',

  '.overlay': {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.border,
    opacity: 0.5,
  },
  '.content': {
    flex: 2,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    marginRight: '15px',
  },
  '.divider': {
    width: '100%',
    height: '1px',
    backgroundColor: colors.border,
    margin: '8px 0',
  },
});

type StationsPickerOptions = {
  openStationsModal: () => void;
};

const StationsCard: React.FC<StationsPickerOptions> = ({
  openStationsModal,
}) => {
  const [startStation, endStation, selectedLine] = useTripSelectionStore(
    (state) => [state.startStation, state.endStation, state.selectedLine],
  );

  const isLineEmpty = selectedLine === null;

  const firstStation = startStation?.name || 'Station de départ';
  const secondStation = endStation?.name || "Station d'arrivée";

  const handleSelectionStations = () => {
    if (isLineEmpty) return;

    openStationsModal();
  };

  return (
    <div css={styles} onClick={handleSelectionStations} data-cy="stations-card">
      {isLineEmpty && <div className="overlay" />}
      <div className="content">
        <p>{firstStation}</p>
        <div className="divider" />
        <p>{secondStation}</p>
      </div>
      <StationsLine />
    </div>
  );
};

export default StationsCard;
