/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';

import { useTripSelectionStore } from '@/features/search/stores/trip-selection.store';
import { Station } from '@/features/search/types/station.types';
import { colors } from '@/styles';

const styles = css({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  position: 'relative',
  '.overlay': {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    opacity: 0.5,
  },
  '.barContainer': {
    flex: '0 0 35%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    '.button': {
      height: 22,
      width: 22,
      padding: 5,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '50%',
      backgroundColor: colors.label,
      '.round': {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        borderRadius: '50%',
      },
    },
    '.bar': {
      flex: 1,
      width: 4,
      backgroundColor: colors.label,
    },
    '.transparent': {
      backgroundColor: 'transparent',
    },
  },
  '.textContainer': {
    flex: 1,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '15px 0',
    p: {
      flex: 1,
      fontWeight: 500,
    },
  },
});

type StationPickerProps = {
  data: Station;
  index: number;
  isLastStation: boolean;
};

const StationPicker: React.FC<StationPickerProps> = ({
  data,
  index,
  isLastStation,
}) => {
  const [startStation, endStation, updateStations] = useTripSelectionStore(
    (state) => [state.startStation, state.endStation, state.updateStations],
  );

  const isSelected = startStation?.id === data.id || endStation?.id === data.id;

  const onSelectStation = () => {
    updateStations(data);
  };

  return (
    <div css={styles} onClick={onSelectStation} data-cy="station-picker">
      {isSelected && <div className="overlay" />}

      <div className="barContainer">
        <div className={`bar ${index === 0 && 'transparent'}`} />
        <div className="button">
          <div className="round" />
        </div>
        <div className={`bar ${isLastStation && 'transparent'}`} />
      </div>
      <div className="textContainer">
        <p>{data.name}</p>
      </div>
    </div>
  );
};

export default StationPicker;
