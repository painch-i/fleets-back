import React, { Fragment } from 'react';
import { FaCalendar } from 'react-icons/fa';
import { IonDatetimeButton } from '@ionic/react';

import { useTripSelectionStore } from '@/features/search/stores/trip-selection.store';
import DatetimeModal from '@/components/DatetimeModal/Datetime.modal';
import { getFleetsDelays } from '@/config/delays.variables';
import useFlag from '@/hooks/use-flag.hook';

const SelectDateTimeModal: React.FC = () => {
  const { MIN_FORMATION_DELAY } = getFleetsDelays(useFlag('USE_SHORT_DELAYS'));

  const [updateFleet, departureTime] = useTripSelectionStore((state) => [
    state.updateFleet,
    state.departureTime,
  ]);

  function handleChange(value: Date): void {
    updateFleet({ departureTime: value });
  }

  return (
    <Fragment>
      <DatetimeModal
        onUpdate={handleChange}
        value={departureTime}
        min={MIN_FORMATION_DELAY}
      />

      <div className="flex h-auto min-h-[50px] w-full flex-wrap items-center justify-between gap-y-2.5 rounded-[13px] border border-solid border-border p-4">
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
