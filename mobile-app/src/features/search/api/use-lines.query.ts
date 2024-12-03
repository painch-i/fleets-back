import { UseQueryResult } from '@tanstack/react-query';

import { TRANSPORT_SUB_MODE } from '@/features/search/constants/mappings.transport';
import { Line, LinesByModes } from '@/features/search/types/line.types';
import { QueryOptions, useBackendQuery } from '@/hooks/use-backend-query.hook';

export const GET_LINES_API_PATH = 'navigation/get-lines';

const linesFormatter = (lines: Line[]) => {
  const linesByMode: LinesByModes = {
    rail: [],
    metro: [],
    tram: [],
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const { mode, subMode } = line;

    if (
      subMode === TRANSPORT_SUB_MODE.REGIONAL_RAIL ||
      subMode === TRANSPORT_SUB_MODE.RAIL_SHUTTLE
    ) {
      continue;
    }

    linesByMode[mode].push(line);
  }

  return linesByMode;
};

/**
 * A custom hook for fetching all the lines from {@link GET_LINES_API_PATH} using the `useBackendQuery` hook.
 *
 * @returns {UseQueryResult<LinesByModes>} UseQueryResult - It contains the data, error, status and other query-related information based on the {@link LinesByModes} type.
 *
 * @description The fetched data is transformed and organized by TransportMode before being returned.
 */
export const useLines = (
  queryOptions?: QueryOptions<Line[], LinesByModes>,
): UseQueryResult<LinesByModes> =>
  useBackendQuery<Line[], LinesByModes>(
    { path: GET_LINES_API_PATH },
    { ...queryOptions, select: linesFormatter },
  );
