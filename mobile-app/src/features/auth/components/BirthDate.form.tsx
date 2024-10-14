import { IonDatetimeCustomEvent } from '@ionic/core';
import { DatetimeChangeEventDetail, IonDatetime } from '@ionic/react';
import { Fragment } from 'react/jsx-runtime';

import { AuthLayoutText } from '@/components/Layout/Auth.layout';

import { useAccountCreation } from '@/features/auth/providers/account-creation.provider';
import { formatDateToStringISO } from '@/utils/date';

const BirthDateForm: React.FC = () => {
  const { accountData, setAccountData, isFieldDisabled } = useAccountCreation();

  function handleDateChange(
    event: IonDatetimeCustomEvent<DatetimeChangeEventDetail>,
  ): void {
    const {
      detail: { value = '' },
    } = event;

    if (!value) return;

    const valueString = typeof value === 'object' ? value[0] : value;
    const birthDate = new Date(valueString);

    setAccountData({ birthDate: birthDate });
  }

  return (
    <Fragment>
      <AuthLayoutText
        title="Date de naissance"
        description="Vous devez être majeur(e) pour accéder à Fleets."
      />
      <IonDatetime
        id="datetime"
        mode="ios"
        presentation="date"
        value={formatDateToStringISO(accountData.birthDate)}
        onIonChange={handleDateChange}
        preferWheel
        disabled={isFieldDisabled['birthDate']}
      />
    </Fragment>
  );
};

export default BirthDateForm;
