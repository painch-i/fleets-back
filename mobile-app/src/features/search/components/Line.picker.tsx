/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { FaBars } from 'react-icons/fa';

import { TransportIcon } from '@/components/TransportIcon/Transport.icon';
import { useTripSelectionStore } from '@/features/search/stores/trip-selection.store';
import { colors } from '@/styles';

const styles = css({
  width: '100%',
  minHeight: '50px',
  height: 'auto',
  padding: '16px',
  display: 'flex',
  flexDirection: 'row',
  borderRadius: '13px',
  border: `1px solid ${colors.border}`,
  alignItems: 'center',
  justifyContent: 'space-between',

  '.content': {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
  },
  '.lineInfos': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    marginLeft: '10px',

    i: {
      color: colors.medium,
      fontSize: '11px',
    },
  },
});

interface LineSelectionOptions {
  openTransportModeModal: () => void;
}

const LinePicker: React.FC<LineSelectionOptions> = ({
  openTransportModeModal,
}) => {
  const [selectedLine, selectedTransportMode] = useTripSelectionStore(
    (state) => [state.selectedLine, state.selectedTransportMode],
  );

  return (
    <div css={styles} onClick={openTransportModeModal} data-cy="line-picker">
      {selectedLine ? (
        <>
          <div className="content">
            <TransportIcon line={selectedLine} size="60px" />
            <div className="lineInfos">
              <p>{selectedLine.name}</p>
              <i>Disponible</i>
            </div>
          </div>
          <selectedTransportMode.icon size={'20px'} />
        </>
      ) : (
        <>
          <p>Sélectionne ta ligne</p>
          <FaBars />
        </>
      )}
    </div>
  );
};

export default LinePicker;
