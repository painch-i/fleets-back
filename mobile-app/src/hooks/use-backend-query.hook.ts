import {
  DefaultError,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

interface BackendQueryOptions {
  path: string;
  signal?: AbortSignal;
  params?: Record<string, any>;
}

export type BackendQueryKey = [
  BackendQueryOptions['path'],
  BackendQueryOptions['params']?,
];

/**
 * A custom hook for fetching data using `useQuery` from `@tanstack/react-query`.
 *
 * @template T The type of data returned by the query.
 * @template TSelect The type of selected data (optional).
 *
 * @param {BackendQueryOptions} options The path & params for the query.
 * @param {Omit<UseQueryOptions<T, DefaultError, TSelect>, 'queryKey'>} [queryOptions] Additional options to configure `useQuery`.
 *
 * @returns {UseQueryResult<TSelect, DefaultError>} The result of the query. It contains the data, error, status and other query-related information.
 */
export function useBackendQuery<T = unknown, TSelect = T>(
  options: BackendQueryOptions,
  queryOptions?: Omit<UseQueryOptions<T, DefaultError, TSelect>, 'queryKey'>,
): UseQueryResult<TSelect, DefaultError> {
  const queryKey: BackendQueryKey = getQueryKey(options);

  return {
    ...useQuery<T, DefaultError, TSelect>({
      ...queryOptions,
      meta: { signal: options.signal },
      refetchOnWindowFocus: false,
      queryKey,
    }),
  };
}

function getQueryKey(options: BackendQueryOptions) {
  const queryKey: BackendQueryKey = [options.path];

  if (options.params) {
    queryKey.push(options.params);
  }

  return queryKey;
}
