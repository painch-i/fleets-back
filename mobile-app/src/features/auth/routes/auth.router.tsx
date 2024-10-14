import { Navigate, Route, Routes } from 'react-router';

import Login from '@/features/auth/routes/Login.route';
import OnBoarding from '@/features/auth/routes/OnBoarding.route';
import OtpVerificationHOC from '@/features/auth/routes/OtpVerification.route';
import Register from '@/features/auth/routes/Register.route';

export const AuthRouter: React.FC = () => (
  <Routes>
    <Route path="/onboarding" Component={OnBoarding} />
    <Route path="/login" Component={Login} />
    <Route path="/register" Component={Register} />
    <Route path="/otp-verification" Component={OtpVerificationHOC} />
    <Route path="/*" element={<Navigate to="/onboarding" />} />
  </Routes>
);
