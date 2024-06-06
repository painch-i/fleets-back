export const getUserDisplayName = (email: string): string => {
  return email.split('@')[0];
};
