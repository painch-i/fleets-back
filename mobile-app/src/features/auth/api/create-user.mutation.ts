import { useLoginMutation } from '@/features/auth/api/login.mutation';
import { User, CreateUserDto } from '@/features/auth/types/user.types';
import {
  useBackendMutation,
  BackendMutationVariables,
  MutationOptions,
} from '@/hooks/use-backend-mutation.hook';

export const CREATE_USER_API_PATH = 'users/create';

/**
 * A custom hook for creating a User from {@link CREATE_USER_API_PATH} using the `useBackendMutation` hook.
 *
 * @param {MutationOptions<User, CreateUserDto>['onError']} onError - The function to be called when the mutation has an error.
 *
 * @returns UseMutationResult - It contains the mutation function, status, error and other mutation-related information based on the {@link CreateUserDto} type.
 *
 * @description If the mutation is successful, a login mutation will be launched.
 */
export function useCreateUserMutation(
  onError: MutationOptions<User, CreateUserDto>['onError'],
) {
  const { mutate: mutateLogin } = useLoginMutation();

  const { mutate, isPending } = useBackendMutation<User, CreateUserDto>(
    {
      path: CREATE_USER_API_PATH,
    },
    {
      onSuccess: (
        user: User,
        variables: BackendMutationVariables<CreateUserDto>,
      ) => {
        mutateLogin({ email: user.email, password: variables.data.password });
      },
      onError,
    },
  );

  return { mutate, isPending };
}
