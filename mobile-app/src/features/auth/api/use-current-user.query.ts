import { UseQueryResult } from '@tanstack/react-query';

import { UserOrPendingUser } from '@/features/auth/types/user.types';
import { useBackendQuery } from '@/hooks/use-backend-query.hook';

export const CURRENT_USER_API_PATH = 'users/me';

/**
 * A custom hook for fetching the current user data from {@link CURRENT_USER_API_PATH} using the `useBackendQuery` hook.
 *
 * @returns {UseQueryResult<User>} UseQueryResult - It contains the data, error, status and other query-related information based on the {@link UserOrPendingUser} type.
 */
export const useCurrentUserQuery = (): UseQueryResult<UserOrPendingUser> =>
  useBackendQuery<UserOrPendingUser>({ path: CURRENT_USER_API_PATH });
