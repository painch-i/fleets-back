import { Navigate, Route, Routes } from 'react-router';

import { AccountCreationProvider } from '@/features/auth/providers/account-creation.provider';

import AccountVerification from '@/features/auth/routes/AccountCreation.route';
import { PendingUser } from '@/features/auth/types/user.types';

type AccountCreationRouterProps = {
  user: PendingUser;
};

export const AccountCreationRouter = ({ user }: AccountCreationRouterProps) => (
  <AccountCreationProvider user={user}>
    <Routes>
      <Route
        key="account-creation"
        path="/account-creation"
        Component={AccountVerification}
      />
      <Route
        key="account-creation-redirect"
        path="/*"
        element={<Navigate to="/account-creation" />}
      />
    </Routes>
  </AccountCreationProvider>
);
