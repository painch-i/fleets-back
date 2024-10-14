import { create } from 'zustand';

import { AUTH_TOKEN_LOCAL_KEY } from '@/constants/local-storage.const';

type IAuthContext = {
  token: string | null;
  updateUserToken: (token: string) => void;
  removeToken: () => void;
};

/**
 * Store for managing user authentication state.
 *
 * @returns {IAuthContext} {@link IAuthContext} - The store object containing state and actions for user authentication.
 */
export const authStore = create<IAuthContext>((set) => {
  const token = localStorage.getItem(AUTH_TOKEN_LOCAL_KEY);

  const updateUserToken = (token: string): void => {
    localStorage.setItem(AUTH_TOKEN_LOCAL_KEY, token);
    set({ token });
  };

  const removeToken = (): void => {
    localStorage.removeItem(AUTH_TOKEN_LOCAL_KEY);
    set({ token: null });
  };

  return {
    token,
    updateUserToken,
    removeToken,
  };
});
