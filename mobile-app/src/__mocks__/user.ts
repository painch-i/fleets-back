import { Gender, User } from '@/features/auth/types/user.types';

export const USER_MOCKED: User = {
  id: '02a6138c-c191-4918-b268-77465dda30a3',
  fleetId: null,
  email: 'example@email.com',
  isPreRegistered: false,
  isRegistered: true,
  gender: Gender.MALE,
  encryptedPassword: '',
};
