import {
  DefaultError,
  UseMutationOptions,
  useMutation,
} from '@tanstack/react-query';

interface BackendMutationOptions {
  path: string;
}

export interface BackendMutationVariables<TVariables = unknown> {
  options: BackendMutationOptions;
  data: TVariables;
}

export type MutationOptions<
  TData = unknown,
  TVariables = void,
> = UseMutationOptions<
  TData,
  DefaultError,
  BackendMutationVariables<TVariables>,
  BackendMutationOptions
>;

/**
 * A custom hook for performing mutations using `useMutation` from `@tanstack/react-query`.
 *
 * @template TData The type of data returned by the mutation.
 * @template TVariables The type of data passed to the mutation (optional).
 *
 * @param {BackendMutationOptions} options The path for the mutation.
 * @param {MutationOptions<TData, TVariables>} mutationOptions Additional options to configure `useMutation`.
 *
 * @returns UseMutationResult - It contains the mutation function, status, error and other mutation-related information.
 */
export function useBackendMutation<TData = unknown, TVariables = void>(
  options: BackendMutationOptions,
  mutationOptions?: MutationOptions<TData, TVariables>,
) {
  const mutation = useMutation<
    TData,
    DefaultError,
    BackendMutationVariables<TVariables>,
    BackendMutationOptions
  >(mutationOptions || {});
  const mutateWithVariables = (data: TVariables) => {
    return mutation.mutate({ data, options });
  };
  const mutateAsyncWithVariables = (data: TVariables) => {
    return mutation.mutateAsync({ data, options });
  };

  return {
    ...mutation,
    mutate: mutateWithVariables,
    mutateAsync: mutateAsyncWithVariables,
  };
}
