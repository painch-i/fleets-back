import { Fragment } from 'react/jsx-runtime';

import Input from '@/components/Input/Input.global';
import Toggle from '@/components/Toggle/Toggle.global';
import { AuthLayoutText } from '@/components/Layout/Auth.layout';

import { useAccountCreation } from '@/features/auth/providers/account-creation.provider';
import { Gender, UserGenderIcons } from '@/features/auth/types/user.types';

const InfosForm: React.FC = () => {
  const { accountData, setAccountData, isFieldDisabled } = useAccountCreation();

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.target;

    setAccountData({ [name]: value });
  }

  function onGenderChange(value: Gender): void {
    setAccountData({ gender: value });
  }

  return (
    <Fragment>
      <AuthLayoutText
        title="INFORMATIONS D'IDENTITÉ"
        description="Remplissez les informations telles qu'elles apparaissent sur vos documents d'identité."
      />
      <Input
        variant="outline"
        label="lastName"
        type="text"
        placeholder="Nom"
        value={accountData.lastName}
        onChange={onInputChange}
        disabled={isFieldDisabled['lastName']}
        containerClassName="rounded-[10px]"
      />
      <Input
        variant="outline"
        label="firstName"
        type="text"
        placeholder="Prénom"
        value={accountData.firstName}
        onChange={onInputChange}
        disabled={isFieldDisabled['firstName']}
        containerClassName="rounded-[10px]"
      />
      <AuthLayoutText
        title="GENRE CIVIL"
        description=" Nous avons besoin de cette information pour des questions de sécurité. Vous pourrez choisir vos pronoms par la suite."
      />
      <Toggle
        value={accountData.gender}
        onChange={onGenderChange}
        defaultValues={[
          { value: Gender.FEMALE, icon: UserGenderIcons.FEMALE },
          { value: Gender.MALE, icon: UserGenderIcons.MALE },
        ]}
        disabled={isFieldDisabled['gender']}
      />
    </Fragment>
  );
};

export default InfosForm;
