import { UseQueryResult } from '@tanstack/react-query';

import { useBackendQuery } from '@/hooks/use-backend-query.hook';
import { RouteSuggestion } from '@/features/search/types/suggestion.types';

export const NAVIGATION_API_PATH = 'navigation/get-route-suggestions';

const suggestionsFormatter = (data: RouteSuggestion[]): RouteSuggestion[] => {
  const hashHistory = new Set();

  return data.reduce<RouteSuggestion[]>((acc, item) => {
    if (item.linesTaken.length > 0 && !hashHistory.has(item.hash)) {
      hashHistory.add(item.hash);
      acc.push(item);
    }

    return acc;
  }, []);
};

type useRouteSuggestionsParams = {
  startStationId?: string;
  endStationId?: string;
};

export const useRouteSuggestionsQuery = (
  params: useRouteSuggestionsParams,
): UseQueryResult<RouteSuggestion[]> => {
  const { startStationId, endStationId } = params;

  const queryOptions = {
    enabled: !!startStationId || !!endStationId,
    select: suggestionsFormatter,
  };

  return useBackendQuery<RouteSuggestion[]>(
    { path: NAVIGATION_API_PATH, params },
    queryOptions,
  );
};
