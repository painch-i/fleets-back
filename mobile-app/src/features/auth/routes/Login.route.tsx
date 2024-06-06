/** @jsxImportSource @emotion/react */

import { IonContent, IonPage, useIonRouter } from '@ionic/react';
import { DefaultError } from '@tanstack/react-query';
import { FaRegEnvelope } from 'react-icons/fa';
import { BiLock } from 'react-icons/bi';

import Button from '@/components/Button/Button.global';
import Input from '@/components/Input/Input.global';
import { useLoginMutation } from '@/features/auth/api/login.mutation';

import { useForm } from '@/hooks/use-form.hook';

import { authLayoutStyles } from '@/features/auth/styles/auth.styles';
import { colors } from '@/styles';

type LoginInputs = {
  email: string;
  password: string;
};

// TODO -> En faire un component commun avec le register
// TODO -> Meilleur design

const Login: React.FC = () => {
  const router = useIonRouter();

  // TODO -> Ici mettre directement validation email (regex)
  const { form, onFormUpdate, isEmpty, onRequestError, errors } =
    useForm<LoginInputs>({
      email: {
        initialValue: '',
      },
      password: {
        initialValue: '',
      },
    });

  const handleLoginError = (error: DefaultError) => {
    // TODO -> Marche pas trop, les erreurs ont pas les bons types. Il faut voir sur le back + bien faire email / password error
    onRequestError('email', error.message);
  };

  const { mutate, isPending } = useLoginMutation(handleLoginError);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { type, value } = e.target;

    onFormUpdate(type, value);
  };

  function handleSubmit(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void {
    e.preventDefault();
    mutate(form);
  }

  function goToRegister(
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>,
  ): void {
    e.preventDefault();
    router.push('/register');
  }

  return (
    <IonPage>
      <IonContent css={authLayoutStyles}>
        <div className="content">
          <div className="background">
            <img src="./assets/logos/logo-white.png" alt="fleet" />
            <h1>Connexion</h1>
            <div className="background-triangle" />
          </div>
          <div className="container">
            <h1>Bon retour !</h1>
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
            </div>
            <div className="submit-container">
              <Button
                onClick={handleSubmit}
                type="submit"
                disabled={isEmpty}
                isLoading={isPending}
              >
                CONNEXION
              </Button>
              <p onClick={goToRegister} data-cy="auth-link-button">
                Vous n'avez pas de compte ?<span> Créez en un !</span>
              </p>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
