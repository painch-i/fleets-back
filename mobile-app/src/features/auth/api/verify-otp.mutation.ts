import { useQueryClient } from '@tanstack/react-query';

import { authStore } from '@/features/auth/stores/auth.store';
import { AccessTokenRes, VerifyOtpDto } from '@/features/auth/types/user.types';

import {
  useBackendMutation,
  MutationOptions,
} from '@/hooks/use-backend-mutation.hook';
import { useEventSocket } from '@/providers/event-socket.provider';

export const VERIFY_OTP_API_PATH = 'users/verify-otp';

/**
 * A custom hook to verify the otp from {@link VERIFY_OTP_API_PATH} using the `useBackendMutation` hook.
 *
 * @param {MutationOptions<AccessTokenRes, VerifyOtpDto>['onError']} onError - The function to be called when the mutation has an error.
 *
 * @returns UseMutationResult - It contains the mutation function, status, error and other mutation-related information based on the {@link VerifyOtpDto} type.
 *
 * @description This request will check if the otp passed is one send to the user's email. If the mutation is successful, the token returned will be stored.
 */
export function useVerifyOtpMutation(
  onError?: MutationOptions<AccessTokenRes, VerifyOtpDto>['onError'],
) {
  const queryClient = useQueryClient();

  const updateUserToken = authStore((state) => state.updateUserToken);
  const { authenticate: authenticateSocket } = useEventSocket();

  return useBackendMutation<AccessTokenRes, VerifyOtpDto>(
    {
      path: VERIFY_OTP_API_PATH,
    },
    {
      onSuccess: (accessTokenRes: AccessTokenRes) => {
        updateUserToken(accessTokenRes.token);
        authenticateSocket(accessTokenRes.token);
        queryClient.invalidateQueries();
      },
      onError,
    },
  );
}
