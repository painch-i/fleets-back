import { DefaultError } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import AuthLayout from '@/components/Layout/Auth.layout';
import Input from '@/components/Input/Input.global';

import { useStartLoginMutation } from '@/features/auth/api/start-login.mutation';
import useLocalStorage from '@/hooks/use-local-storage.hook';
import { useForm } from '@/hooks/use-form.hook';

import { LAST_OTP_SENT_KEY } from '@/constants/local-storage.const';
import { StartLoginDto } from '@/features/auth/types/user.types';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const { storedValue, setValue } = useLocalStorage(
    LAST_OTP_SENT_KEY,
    Date.now() - 60000,
  );

  // TODO -> Ici mettre directement validation email (regex)
  const { form, onFormUpdate, isEmpty, onRequestError, errors } =
    useForm<StartLoginDto>({
      email: {
        initialValue: '',
      },
    });

  const { mutate, isPending } = useStartLoginMutation(
    onStartLoginMutationError,
    onStartLoginMutationSuccess,
  );

  function onStartLoginMutationError(error: DefaultError): void {
    // TODO -> Marche pas trop, les erreurs ont pas les bons types. Il faut voir sur le back + bien faire email / password error
    onRequestError('email', error.message);
  }

  function onStartLoginMutationSuccess(): void {
    setValue(Date.now());

    navigateToOtpVerification();
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { type, value } = e.target;

    onFormUpdate(type, value);
  }

  function redirectToOnboarding(): void {
    history.back();
  }

  function handleSubmit(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void {
    e.preventDefault();

    const currentTime = Date.now();

    if (currentTime - storedValue >= 60000) {
      mutate(form);
      return;
    }

    navigateToOtpVerification();
  }

  function navigateToOtpVerification(): void {
    navigate(`/otp-verification?email=${form.email}&type=login`);
  }

  return (
    <AuthLayout.Root>
      <AuthLayout.Content>
        <AuthLayout.Header
          title="Connexion"
          onClickIconLeft={redirectToOnboarding}
        />
        <AuthLayout.Text
          title="Bon retour !"
          description="Accédez à votre compte en entrant votre email."
        />
        <Input
          variant="outline"
          label="Email"
          type="email"
          placeholder="Email"
          onChange={onChange}
          value={form.email}
          error={errors.email}
          containerClassName="rounded-[10px]"
        />
      </AuthLayout.Content>
      <AuthLayout.Button
        onClick={handleSubmit}
        disabled={isEmpty}
        isLoading={isPending}
      />
    </AuthLayout.Root>
  );
};

export default Login;
