import { StartRegistrationDto } from '@/features/auth/types/user.types';
import {
  useBackendMutation,
  MutationOptions,
} from '@/hooks/use-backend-mutation.hook';

export const START_REGISTRATION_API_PATH = 'users/start-registration';

/**
 * A custom hook to start the registration of the user from {@link START_REGISTRATION_API_PATH} using the `useBackendMutation` hook.
 *
 * @param {MutationOptions<void, StartRegistrationDto>['onError']} onError - The function to be called when the mutation has an error.
 * @param {MutationOptions<void, StartRegistrationDto>['onSuccess']} onSuccess - The function to be called when the mutation is successful.
 *
 * @returns UseMutationResult - It contains the mutation function, status, error and other mutation-related information based on the {@link StartRegistrationDto} type.
 *
 * @description This request will check if the email passed is linked to a User. If it's, an Error will be send. If not, it will send an OTP to the user's email.
 */
export function useStartRegistrationMutation(
  onError: MutationOptions<void, StartRegistrationDto>['onError'],
  onSuccess?: MutationOptions<void, StartRegistrationDto>['onSuccess'],
) {
  return useBackendMutation<void, StartRegistrationDto>(
    {
      path: START_REGISTRATION_API_PATH,
    },
    {
      onSuccess,
      onError,
    },
  );
}
