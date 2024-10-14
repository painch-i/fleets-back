import AuthLayout from '@/components/Layout/Auth.layout';
import InfosForm from '@/features/auth/components/Infos.form';
import BirthDateForm from '@/features/auth/components/BirthDate.form';

import { useCompleteRegistrationMutation } from '@/features/auth/api/complete-registration.mutation';
import { useAccountCreation } from '@/features/auth/providers/account-creation.provider';

const AccountCreation: React.FC = () => {
  const { currentStep, accountData, setCurrentStep } = useAccountCreation();

  const { mutate, error, isPending } = useCompleteRegistrationMutation();

  const isFirstStep = currentStep === 0;

  const CurrentFormComponent = isFirstStep ? InfosForm : BirthDateForm;

  const isButtonValid =
    (isFirstStep && accountData.firstName && accountData.lastName) ||
    (!isFirstStep && accountData.birthDate);

  const handleOnPrevStep = () => setCurrentStep(0);
  const handleOnNextStep = () => setCurrentStep(1);

  function handleOnClickButton(): void {
    if (isFirstStep) {
      handleOnNextStep();
      return;
    }

    mutate(accountData);
  }

  return (
    <AuthLayout.Root>
      <AuthLayout.Content>
        <AuthLayout.Header
          title="Création de compte"
          showIconLeft={currentStep === 1}
          onClickIconLeft={handleOnPrevStep}
        />
        <CurrentFormComponent />
        {error && <p className="text-error">{error.message}</p>}
      </AuthLayout.Content>
      <AuthLayout.Button
        onClick={handleOnClickButton}
        disabled={!isButtonValid}
        isLoading={isPending}
      />
    </AuthLayout.Root>
  );
};

export default AccountCreation;
