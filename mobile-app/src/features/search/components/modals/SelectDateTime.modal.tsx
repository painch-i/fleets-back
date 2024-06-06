/** @jsxImportSource @emotion/react */
import React, { Fragment } from 'react';

import { FaCalendar } from 'react-icons/fa';
import { css } from '@emotion/react';
import { IonDatetimeButton } from '@ionic/react';

import { useTripSelectionStore } from '@/features/search/stores/trip-selection.store';
import { colors } from '@/styles';
import DatetimeModal from '@/components/DatetimeModal/Datetime.modal';

const styles = css({
  width: '100%',
  minHeight: 50,
  height: 'auto',
  padding: 16,
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  rowGap: 10,
  borderRadius: '13px',
  border: `1px solid ${colors.border}`,
  alignItems: 'center',
  justifyContent: 'space-between',
  p: {
    order: 1,
  },
  'ion-datetime-button': {
    order: 2,
  },
  svg: {
    order: 3,
  },
  '@media screen and (max-width: 381px)': {
    svg: {
      order: 1,
    },
    'ion-datetime-button': {
      order: 2,
    },
  },
});

const SelectDateTimeModal: React.FC = () => {
  const [updateFleet, departureTime] = useTripSelectionStore((state) => [
    state.updateFleet,
    state.departureTime,
  ]);

  function handleChange(value: Date): void {
    updateFleet({ departureTime: value });
  }

  return (
    <Fragment>
      <DatetimeModal onUpdate={handleChange} value={departureTime} min={5} />

      <div css={styles}>
        <p>Départ le :</p>

        <IonDatetimeButton
          datetime="datetime"
          data-cy="datetime-buttons-container"
        />

        <FaCalendar />
      </div>
    </Fragment>
  );
};

export default SelectDateTimeModal;
