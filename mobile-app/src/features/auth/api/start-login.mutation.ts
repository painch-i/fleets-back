import { StartLoginDto } from '@/features/auth/types/user.types';
import {
  useBackendMutation,
  MutationOptions,
} from '@/hooks/use-backend-mutation.hook';

export const START_LOGIN_API_PATH = 'users/start-login';

/**
 * A custom hook to start login the user from {@link START_LOGIN_API_PATH} using the `useBackendMutation` hook.
 *
 * @param {MutationOptions<void, StartLoginDto>['onError']} onError - The function to be called when the mutation has an error.
 * @param {MutationOptions<void, StartLoginDto>['onSuccess']} onSuccess - The function to be called when the mutation is successful.
 *
 * @returns UseMutationResult - It contains the mutation function, status, error and other mutation-related information based on the {@link StartLoginDto} type.
 *
 * @description This request will check if the email passed is linked to a User. If it's, it will send an OTP to the user's email. If not, an Error will be send.
 */
export function useStartLoginMutation(
  onError: MutationOptions<void, StartLoginDto>['onError'],
  onSuccess?: MutationOptions<void, StartLoginDto>['onSuccess'],
) {
  return useBackendMutation<void, StartLoginDto>(
    {
      path: START_LOGIN_API_PATH,
    },
    {
      onSuccess,
      onError,
    },
  );
}
