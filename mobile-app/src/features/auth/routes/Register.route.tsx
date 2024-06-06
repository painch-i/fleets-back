/** @jsxImportSource @emotion/react */

import { IonContent, IonPage, useIonRouter } from '@ionic/react';
import { DefaultError } from '@tanstack/react-query';
import { FaRegEnvelope } from 'react-icons/fa';
import { BiLock } from 'react-icons/bi';

import { useCreateUserMutation } from '@/features/auth/api/create-user.mutation';
import {
  CreateUserDto,
  Gender,
  UserGenderIcons,
} from '@/features/auth/types/user.types';
import { useForm } from '@/hooks/use-form.hook';

import Toggle from '@/components/Toggle/Toggle.global';
import Button from '@/components/Button/Button.global';
import Input from '@/components/Input/Input.global';

import { authLayoutStyles } from '@/features/auth/styles/auth.styles';
import { colors } from '@/styles';

const Register: React.FC = () => {
  const router = useIonRouter();

  const { form, onFormUpdate, isValid, onRequestError, errors } =
    useForm<CreateUserDto>({
      email: {
        initialValue: '',
      },
      password: {
        initialValue: '',
      },
      gender: {
        initialValue: Gender.FEMALE,
      },
    });

  const handleLoginError = (error: DefaultError): void => {
    onRequestError('email', error.message);
  };

  const { mutate, isPending } = useCreateUserMutation(handleLoginError);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { type, value } = e.target;

    onFormUpdate(type, value);
  };

  function onGenderChange(value: Gender): void {
    onFormUpdate('gender', value);
  }

  function handleSubmit(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void {
    e.preventDefault();
    mutate(form);
  }

  function goToLogin(
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>,
  ): void {
    e.preventDefault();
    router.push('/login');
  }

  return (
    <IonPage>
      <IonContent css={authLayoutStyles}>
        <div className="content">
          <div className="background">
            <img src="./assets/logos/logo-white.png" alt="fleet" />
            <h1>Inscription</h1>
            <div className="background-triangle" />
          </div>
          <div className="container">
            <h1>Bienvenue !</h1>
            <div className="inputs-container">
              <Input
                type="email"
                placeholder="Entrez votre email"
                onChange={onChange}
                value={form.email}
                error={errors.email}
                label="Email"
                icon={<FaRegEnvelope color={colors.medium} size={20} />}
                variant="subtle"
              />
              <Input
                type="password"
                placeholder="Entrez votre mot de passe"
                onChange={onChange}
                value={form.password}
                label="Mot de passe"
                icon={<BiLock color={colors.medium} size={22} />}
                variant="subtle"
              />
              <Toggle
                value={form.gender}
                onChange={onGenderChange}
                defaultValues={[
                  { value: Gender.FEMALE, icon: UserGenderIcons.FEMALE },
                  { value: Gender.MALE, icon: UserGenderIcons.MALE },
                ]}
              />
            </div>
            <div className="submit-container">
              <Button
                onClick={handleSubmit}
                type="submit"
                disabled={!isValid}
                isLoading={isPending}
              >
                INSCRIPTION
              </Button>
              <p onClick={goToLogin} data-cy="auth-link-button">
                Vous avez déjà un compte ?<span> Connectez-vous !</span>
              </p>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;
