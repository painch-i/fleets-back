import { UseQueryResult } from '@tanstack/react-query';

import { JoinRequest } from '@/features/fleets/types/joinRequest.types';
import { useBackendQuery } from '@/hooks/use-backend-query.hook';

export const FLEET_REQUESTS_LIST_API_PATH =
  'fleets/{fleetId}/list-join-requests';

/**
 * A custom hook for fetching all the join requests of a Fleet from {@link FLEET_REQUESTS_LIST_API_PATH} using the `useBackendQuery` hook.
 *
 * @param {string} fleetId - The ID of the Fleet whose join requests are to be retrieved.
 * @param {boolean} isFleetAdmin - A boolean indicating whether the current user is the Fleet's admin. If true, the query is enabled and data is fetched. If false, the query is not enabled, and no request is sent.
 *
 * @returns {UseQueryResult<JoinRequest[]>} UseQueryResult - It contains the data, error, status and other query-related information based on the {@link JoinRequest} type.
 */
export const useFleetJoinRequestListQuery = (
  fleetId: string,
  isFleetAdmin: boolean,
): UseQueryResult<JoinRequest[]> => {
  const queryOptions = {
    enabled: !!fleetId && isFleetAdmin,
  };

  return useBackendQuery<JoinRequest[]>(
    {
      path: `${FLEET_REQUESTS_LIST_API_PATH.replace('{fleetId}', fleetId)}`,
    },
    queryOptions,
  );
};
