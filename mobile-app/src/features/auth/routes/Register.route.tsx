import { useNavigate } from 'react-router';
import { DefaultError } from '@tanstack/react-query';

import AuthLayout from '@/components/Layout/Auth.layout';
import Input from '@/components/Input/Input.global';

import { useStartRegistrationMutation } from '@/features/auth/api/start-registration.mutation';
import { useForm } from '@/hooks/use-form.hook';
import useLocalStorage from '@/hooks/use-local-storage.hook';

import { LAST_OTP_SENT_KEY } from '@/constants/local-storage.const';
import { StartRegistrationDto } from '@/features/auth/types/user.types';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const { storedValue, setValue } = useLocalStorage(
    LAST_OTP_SENT_KEY,
    Date.now() - 60000,
  );

  const { form, onFormUpdate, isEmpty, onRequestError, errors } =
    useForm<StartRegistrationDto>({
      email: {
        initialValue: '',
      },
    });

  const { mutate, isPending } = useStartRegistrationMutation(
    onStartRegistrationMutationError,
    onStartRegistrationMutationSuccess,
  );

  function onStartRegistrationMutationError(error: DefaultError): void {
    // TODO -> Marche pas trop, les erreurs ont pas les bons types. Il faut voir sur le back + bien faire email / password error
    onRequestError('email', error.message);
  }

  function onStartRegistrationMutationSuccess(): void {
    setValue(Date.now());

    navigateToOtpVerification();
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { type, value } = e.target;

    onFormUpdate(type, value);
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

  function redirectToOnboarding(): void {
    history.back();
  }

  return (
    <AuthLayout.Root>
      <AuthLayout.Content>
        <AuthLayout.Header
          title="Inscription"
          onClickIconLeft={redirectToOnboarding}
        />
        <AuthLayout.Text
          title="Bienvenue !"
          description="Commencez la création de votre compte en vous inscrivant."
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

export default Register;
