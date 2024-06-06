import { useQueryClient } from '@tanstack/react-query';

import { authStore } from '@/features/auth/stores/auth.store';
import { AccessTokenDto, LoginUserDto } from '@/features/auth/types/user.types';

import {
  MutationOptions,
  useBackendMutation,
} from '@/hooks/use-backend-mutation.hook';

import { useEventSocket } from '@/providers/event-socket.provider';

export const LOGIN_API_PATH = 'auth/login';

/**
 * A custom hook for creating a User from {@link LOGIN_API_PATH} using the `useBackendMutation` hook.
 *
 * @param {MutationOptions<AccessTokenDto, LoginUserDto>['onError']} onError - The function to be called when the mutation has an error.
 *
 * @returns UseMutationResult - It contains the mutation function, status, error and other mutation-related information based on the {@link LoginUserDto} type.
 *
 * @description If the mutation is successful, the token returned will be stored.
 */
export function useLoginMutation(
  onError?: MutationOptions<AccessTokenDto, LoginUserDto>['onError'],
) {
  const updateUserToken = authStore((state) => state.updateUserToken);

  const queryClient = useQueryClient();
  const { authenticate: authenticateSocket } = useEventSocket();
  const { mutate, isPending } = useBackendMutation<
    AccessTokenDto,
    LoginUserDto
  >(
    {
      path: LOGIN_API_PATH,
    },
    {
      onSuccess: (accessTokenResponse: AccessTokenDto) => {
        console.log('accessTokenResponse', accessTokenResponse);
        console.log('authenticateSocket', authenticateSocket);
        updateUserToken(accessTokenResponse.access_token);
        authenticateSocket(accessTokenResponse.access_token);
        queryClient.invalidateQueries();
      },
      onError,
    },
  );

  return { mutate, isPending };
}
