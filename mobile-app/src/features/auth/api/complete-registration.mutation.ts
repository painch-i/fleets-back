import { useQueryClient } from '@tanstack/react-query';

import { useBackendMutation } from '@/hooks/use-backend-mutation.hook';
import { CompleteRegistrationDto } from '@/features/auth/types/user.types';
import { CURRENT_USER_API_PATH } from '@/features/auth/api/use-current-user.query';

export const COMPLETE_REGISTRATION_API_PATH = 'users/complete-registration';

/**
 * A custom hook to complete the registration of the user from {@link COMPLETE_REGISTRATION_API_PATH} using the `useBackendMutation` hook.
 *
 * @returns UseMutationResult - It contains the mutation function, status, error and other mutation-related information based on the {@link CompleteRegistrationDto} type.
 *
 * @description This request will check if User is a least 18 years old. If yes, it will update his data. If not, it will send an Error.
 */
export function useCompleteRegistrationMutation() {
  const queryClient = useQueryClient();

  return useBackendMutation<void, CompleteRegistrationDto>(
    {
      path: COMPLETE_REGISTRATION_API_PATH,
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries({
          queryKey: [CURRENT_USER_API_PATH],
        });
      },
    },
  );
}
