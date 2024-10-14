import { Gender, User } from '@/features/auth/types/user.types';
import { getUserDisplayName } from '@/utils/user';

const user: User = {
  email: 'example@example.com',
  firstName: 'example',
  id: 'uuid',
  lastName: 'example',
  birthDate: new Date('1990-01-01'),
  gender: Gender.MALE,
  fleetId: null,
  isOnboarded: true,
};

describe('Utils | user | getUserDisplayName', () => {
  it('should return the correct display name for a valid email', () => {
    expect(getUserDisplayName(user)).toBe('example');
  });
});
