import { User } from '@/features/auth/types/user.types';

export const getUserDisplayName = (user: User): string => {
  if (user.firstName) {
    return user.firstName;
  }
  return user.email.split('@')[0];
};
