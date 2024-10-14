import React, { createContext, useState } from 'react';

import {
  CompleteRegistrationDto,
  Gender,
  IAccountCreationContext,
  PendingUser,
} from '@/features/auth/types/user.types';

let AccountCreationContext: React.Context<IAccountCreationContext> | null =
  null;

interface AccountCreationProps {
  children: React.ReactNode;
  user: PendingUser;
}

export function AccountCreationProvider({
  children,
  user,
}: AccountCreationProps) {
  const [currentStep, setCurrentStep] = useState<0 | 1>(0);
  const isFieldDisabled = {
    gender: !!user.gender,
    lastName: !!user.lastName,
    firstName: !!user.firstName,
    birthDate: !!user.birthDate,
  };
  const [accountData, setAccountData] = useState<CompleteRegistrationDto>({
    gender: user.gender || Gender.FEMALE,
    lastName: user.lastName || '',
    firstName: user.firstName || '',
    birthDate: user.birthDate ? new Date(user.birthDate) : new Date(),
  });

  function handleAccountDataUpdate(
    value: Partial<CompleteRegistrationDto>,
  ): void {
    setAccountData((prevState) => ({ ...prevState, ...value }));
  }

  if (AccountCreationContext === null) {
    AccountCreationContext = createContext<IAccountCreationContext>({
      currentStep,
      accountData,
      setCurrentStep,
      setAccountData: handleAccountDataUpdate,
      isFieldDisabled,
    });
  }

  return (
    <AccountCreationContext.Provider
      value={{
        currentStep,
        accountData,
        setCurrentStep,
        setAccountData: handleAccountDataUpdate,
        isFieldDisabled,
      }}
    >
      {children}
    </AccountCreationContext.Provider>
  );
}

export function useAccountCreation() {
  if (AccountCreationContext === null) {
    throw new Error(
      'useAccountCreation must be used within a AccountCreationProvider',
    );
  }

  const context = React.useContext(AccountCreationContext);

  if (context === undefined) {
    throw new Error(
      'useAccountCreation must be used within a AccountCreationProvider',
    );
  }

  return context;
}
