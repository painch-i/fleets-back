import { Gender, PendingUser, User } from '@/features/auth/types/user.types';

export const PENDING_USER_MOCKED: PendingUser = {
  email: 'example@email.com',
  firstName: null,
  lastName: null,
  birthDate: null,
  gender: null,
  isOnboarded: false,
};

export const USER_MOCKED: User = {
  id: '02a6138c-c191-4918-b268-77465dda30a3',
  firstName: 'example',
  lastName: 'email',
  birthDate: new Date(),
  fleetId: null,
  email: PENDING_USER_MOCKED.email,
  gender: Gender.MALE,
  isOnboarded: true,
};
