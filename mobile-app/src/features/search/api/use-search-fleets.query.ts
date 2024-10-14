import { UseQueryResult } from '@tanstack/react-query';

import { useBackendQuery } from '@/hooks/use-backend-query.hook';
import { Fleet, GenderConstraint } from '@/features/fleets/types/fleet.types';

type UseSearchFleetsParams = {
  startStationId?: string;
  endStationId?: string;
  departureTime?: string;
  genderConstraint: GenderConstraint;
};

export const SEARCH_FLEETS_API_PATH = 'fleets/search-fleets';

const selectFleetsByGenderConstraint = (
  data: Fleet[],
  genderConstraint: GenderConstraint,
) => {
  if (genderConstraint === GenderConstraint.NO_CONSTRAINT) {
    return data;
  }

  return data.filter((fleet) => fleet.genderConstraint === genderConstraint);
};

/**
 * A custom hook for searching a Fleet based on some params from {@link SEARCH_FLEETS_API_PATH} using the `useBackendQuery` hook.
 *
 * @param {UseSearchFleetsParams} params {@link UseSearchFleetsParams} - Params for the Fleet search.
 *
 * @returns {UseQueryResult<Fleet[]>} UseQueryResult - It contains the data, error, status and other query-related information based on the {@link Fleet} type.
 *
 * @description The request won't be send until `startStationId`, `endStationId` and `departureTime` are filled. The fetched data is filtered by {@link GenderConstraint} before being returned.
 */
export const useSearchFleets = (
  params: UseSearchFleetsParams,
): UseQueryResult<Fleet[]> => {
  const { startStationId, endStationId, departureTime, genderConstraint } =
    params;

  const queryOptions = {
    enabled: !!startStationId || !!endStationId || !!departureTime,
    select: (data: Fleet[]) =>
      selectFleetsByGenderConstraint(data, genderConstraint),
  };

  return useBackendQuery<Fleet[]>(
    { path: SEARCH_FLEETS_API_PATH, params },
    queryOptions,
  );
};
