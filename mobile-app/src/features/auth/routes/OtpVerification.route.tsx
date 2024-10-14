import { useSearchParams } from 'react-router-dom';
import { Navigate } from 'react-router';
import { useState } from 'react';

import AuthLayout from '@/components/Layout/Auth.layout';
import CodeInput from '@/components/Input/Code.input';
import OtpCountdown from '@/features/auth/components/Otp.countdown';

import { useStartLoginMutation } from '@/features/auth/api/start-login.mutation';
import { useStartRegistrationMutation } from '@/features/auth/api/start-registration.mutation';
import { useVerifyOtpMutation } from '@/features/auth/api/verify-otp.mutation';
import useFlag from '@/hooks/use-flag.hook';

const OtpVerificationHOC: React.FC = () => {
  const [searchParams] = useSearchParams();

  const email = searchParams.get('email');
  const type = searchParams.get('type');

  if (!email || (type !== 'login' && type !== 'registration')) {
    return <Navigate to="/onBoarding" />;
  }

  const useResendOtpMutation =
    type === 'login' ? useStartLoginMutation : useStartRegistrationMutation;

  return (
    <OtpVerification
      email={email}
      type={type}
      useResendOtpMutation={useResendOtpMutation}
    />
  );
};

type OtpVerificationProps = {
  email: string;
} & (
  | {
      type: 'login';
      useResendOtpMutation: typeof useStartLoginMutation;
    }
  | {
      type: 'registration';
      useResendOtpMutation: typeof useStartRegistrationMutation;
    }
);

const OtpVerification: React.FC<OtpVerificationProps> = ({
  email,
  useResendOtpMutation,
}) => {
  const isBypassOtpVerificationFlagOn = useFlag('BYPASS_OTP_VERIFICATION');

  const [otp, setOtp] = useState<string>(
    isBypassOtpVerificationFlagOn ? '000000' : '',
  );

  const { mutateAsync } = useResendOtpMutation(
    onResendOtpMutationError,
    onResendOtpMutationSuccess,
  );

  const { mutate, isPending, error, isError } = useVerifyOtpMutation();

  // TODO -> Gerer les errors en fonction du type (login / register)
  function onResendOtpMutationError(): void {}

  // TODO -> Mettre un ptit message | ou loader qui se transform en validate ? Voir design
  function onResendOtpMutationSuccess(): void {}

  async function onClickResendOtp(): Promise<void> {
    await mutateAsync({ email });
  }

  function redirectToPreviousPage(): void {
    history.back();
  }

  function handleSubmit(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void {
    e.preventDefault();

    mutate({ email, otp });
  }

  return (
    <AuthLayout.Root>
      <AuthLayout.Content>
        <AuthLayout.Header
          title="Vérifie ton email"
          onClickIconLeft={redirectToPreviousPage}
        />
        <AuthLayout.Text
          title="Rentre ton code !"
          description={`Nous venons d'envoyer le code à votre email : ${email}.`}
        />
        <CodeInput onChange={setOtp} aria-invalid={isError} displayToolbar />
        {error && <p className="text-error">{error.message}</p>}
        <OtpCountdown onClick={onClickResendOtp} />
      </AuthLayout.Content>
      <AuthLayout.Button
        onClick={handleSubmit}
        disabled={otp?.length !== 6}
        isLoading={isPending}
      />
    </AuthLayout.Root>
  );
};

export default OtpVerificationHOC;
