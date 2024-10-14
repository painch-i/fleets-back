import { UseQueryResult } from '@tanstack/react-query';

import { useBackendQuery } from '@/hooks/use-backend-query.hook';
import { Station } from '@/features/search/types/station.types';

export const GET_STATIONS_IN_LINE_API_PATH = 'navigation/get-stations-in-line';

/**
 * A custom hook for getting all the stations of a line from {@link GET_STATIONS_IN_LINE_API_PATH} using the `useBackendQuery` hook.
 *
 * @param {string} lineId - The ID of the Line whose stations are to be retrieved. The request isn't enabled until the lineId is filled.
 *
 * @returns {UseQueryResult<Station[]>} UseQueryResult - It contains the data, error, status and other query-related information based on the {@link Station} type.
 */
export const useStationsByLine = (
  lineId?: string,
): UseQueryResult<Station[]> => {
  const queryOptions = {
    enabled: !!lineId,
  };

  return useBackendQuery<Station[]>(
    {
      path: GET_STATIONS_IN_LINE_API_PATH,
      params: { lineId },
    },
    queryOptions,
  );
};
