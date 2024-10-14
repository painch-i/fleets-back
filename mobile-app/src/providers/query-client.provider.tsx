import { useEffect } from 'react';

import {
  QueryClientProvider as ExternalQueryClientProvider,
  QueryClient,
} from '@tanstack/react-query';

import { BACKEND_URL } from '@/config/config.variables';
import { authStore } from '@/features/auth/stores/auth.store';
import { BackendMutationVariables } from '@/hooks/use-backend-mutation.hook';
import { BackendQueryKey } from '@/hooks/use-backend-query.hook';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      queryFn: async ({ queryKey, meta }) => {
        const signal = meta?.signal as AbortSignal | undefined;
        const [path, params] = queryKey as BackendQueryKey;
        const queryParams = new URLSearchParams(params);
        let queryParamsString = '';

        if (params !== undefined) {
          queryParamsString = `?${queryParams.toString()}`;
        }

        const token = authStore.getState().token;
        const headers = new Headers();

        if (token !== null) {
          headers.append('Authorization', `Bearer ${token}`);
        }

        const response = await fetch(
          `${BACKEND_URL}/${path}${queryParamsString}`,
          {
            signal,
            headers,
          },
        );

        if (response.status >= 400) {
          if (
            response.headers.get('Content-Type')?.includes('application/json')
          ) {
            const json = await response.json();
            throw new Error(json);
          }

          throw new Error(await response.text());
        }

        return await response.json();
      },
    },
    mutations: {
      mutationFn: async (unvalidatedContext: unknown) => {
        if (typeof unvalidatedContext !== 'object') {
          throw new Error('variables must be an object');
        }

        const { options, data } =
          unvalidatedContext as BackendMutationVariables;

        const token = authStore.getState().token;

        const headers = new Headers({
          'Content-Type': 'application/json',
        });

        if (token !== null) {
          headers.append('Authorization', `Bearer ${token}`);
        }
        const response = await fetch(`${BACKEND_URL}/${options.path}`, {
          method: 'POST',
          headers,
          body: JSON.stringify(data || {}),
        });

        if (response.status >= 400) {
          throw new BackendMutationError(await response.json());
        }

        if (
          response.headers.get('Content-Type')?.includes('application/json')
        ) {
          return await response.json();
        }
      },
    },
  },
});
export function QueryClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const unsubscribe = authStore.subscribe(() => {
      queryClient.resetQueries();
    });

    // Cleanup subscription when component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <ExternalQueryClientProvider client={queryClient}>
      {children}
    </ExternalQueryClientProvider>
  );
}

export class BackendMutationError extends Error {
  public readonly data: unknown;
  constructor(data: unknown) {
    let message = 'Unknown error';
    if (typeof data === 'string') {
      message = data;
    } else if (typeof data === 'object' && data !== null) {
      if ('message' in data && typeof data.message === 'string') {
        message = data.message;
      } else if ('error' in data && typeof data.error === 'string') {
        message = data.error;
      }
    }
    super(message);
    this.data = data;
  }
}
