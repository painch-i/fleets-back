import { getUserDisplayName } from '@/utils/user';

describe('Utils | user | getUserDisplayName', () => {
  it('should return the correct display name for a valid email', () => {
    expect(getUserDisplayName('example@example.com')).toBe('example');
  });

  it('should return the same email if it does not contain an "@" symbol', () => {
    expect(getUserDisplayName('invalidemail')).toBe('invalidemail');
  });
});
