import { UseQueryResult } from '@tanstack/react-query';

import { Fleet } from '@/features/fleets/types/fleet.types';
import { useBackendQuery } from '@/hooks/use-backend-query.hook';

export const FLEETS_API_PATH = 'fleets/current';

/**
 * A custom hook for fetching the current Fleet data from {@link FLEETS_API_PATH} using the `useBackendQuery` hook.
 *
 * @returns {UseQueryResult<Fleet>} UseQueryResult - It contains the data, error, status and other query-related information based on the {@link Fleet} type.
 */
export const useCurrentFleetQuery = (): UseQueryResult<Fleet> =>
  useBackendQuery<Fleet>({
    path: FLEETS_API_PATH,
  });
