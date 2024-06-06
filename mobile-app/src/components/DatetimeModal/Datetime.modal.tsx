/** @jsxImportSource @emotion/react */

import React, { useEffect } from 'react';
import { css } from '@emotion/react';
import { IonDatetime, IonModal, DatetimeChangeEventDetail } from '@ionic/react';
import { IonDatetimeCustomEvent } from '@ionic/core';

import { formatDateToStringISO } from '@/utils/date';
import { colors } from '@/styles';

const styles = css({
  '::part(content)': {
    padding: 10,
    borderRadius: 13,
    backgroundColor: 'white',
  },
  'ion-datetime': {
    '--background': 'transparent',
    '--background-rgb': 'inherit',
    '--ion-color-primary': colors.primary,
    '::part(calendar-day active)': {
      fontSize: 'min(1.25rem, 32px)',
    },
  },
});

type DatetimeModalProps = {
  /**
   * Callback function to handle updating the selected date and time.
   */
  onUpdate: (value: Date) => void;
  /**
   * The value of the date and time.
   */
  value: Date;
  /**
   * The minimum selectable date and time in minutes.
   * @default 10
   */
  min?: number;
  /**
   * Presentation style of the datetime picker.
   */
  presentation?: HTMLIonDatetimeElement['presentation'];
};

/**
 * Renders a DatetimeModal using Ionic modal for selecting date and time.
 *
 * @param {DatetimeModalProps} {@link DatetimeModalProps} - Props for the DatetimeModal component.
 *
 * @returns {JSX.Element} JSX.Element - The rendered DatetimeModal component.
 *
 * @description This component provides a modal for selecting date and time using Ionic's Datetime component. Need to be use with IonDatetimeButton.
 *
 * @example
 * <DatetimeModal
 *   onUpdate={(value) => handleUpdate(value)}
 *   value={new Date()}
 * />
 * <IonDatetimeButton datetime="datetime" />
 */
const DatetimeModal: React.FC<DatetimeModalProps> = ({
  presentation,
  min = 10,
  value,
  onUpdate,
}: DatetimeModalProps): JSX.Element => {
  const [minDate, setMinDate] = React.useState<Date>(value);

  useEffect(
    function handleMinDate() {
      const interval = setInterval(() => {
        const currentTime = new Date();
        currentTime.setSeconds(0);
        currentTime.setMilliseconds(0);
        const minimumTime = new Date(currentTime.getTime() + min * 60000);

        if (minimumTime !== minDate) {
          setMinDate(minimumTime);
        }

        if (value >= minimumTime) {
          return;
        }

        onUpdate(minimumTime);
      }, 1000);

      return () => clearInterval(interval);
    },
    [min, value],
  );

  const handleChange = (
    event: IonDatetimeCustomEvent<DatetimeChangeEventDetail>,
  ) => {
    const {
      detail: { value = '' },
    } = event;

    if (!value) return;

    const valueToFormat = typeof value === 'object' ? value[0] : value;
    const dateChoose = new Date(valueToFormat);

    onUpdate(dateChoose);
  };

  return (
    <IonModal
      mode="ios"
      keepContentsMounted
      css={styles}
      data-cy="datetime-modal"
    >
      <IonDatetime
        id="datetime"
        mode="ios"
        value={formatDateToStringISO(value)}
        min={formatDateToStringISO(minDate)}
        onIonChange={handleChange}
        {...(presentation && {
          presentation,
        })}
        data-cy="datetime-modal-content"
      />
    </IonModal>
  );
};

export default DatetimeModal;
