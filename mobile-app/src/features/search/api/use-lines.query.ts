import { UseQueryResult } from '@tanstack/react-query';

import { TransportSubMode } from '@/features/search/types/transport.types';
import { Line, LinesByModes } from '@/features/search/types/line.types';
import { useBackendQuery } from '@/hooks/use-backend-query.hook';

export const GET_LINES_API_PATH = 'navigation/get-lines';

const linesFormatter = (lines: Line[]) => {
  const linesByMode: LinesByModes = {
    rail: [],
    metro: [],
    tram: [],
  };

  for (let i = 0; i < lines.length; i++) {
    const { mode, subMode }: Line = lines[i];

    if (
      subMode === TransportSubMode.REGIONAL_RAIL ||
      subMode === TransportSubMode.RAIL_SHUTTLE
    ) {
      continue;
    }

    linesByMode[mode].push(lines[i]);
  }

  return linesByMode;
};

const queryOptions = {
  select: linesFormatter,
};

/**
 * A custom hook for fetching all the lines from {@link GET_LINES_API_PATH} using the `useBackendQuery` hook.
 *
 * @returns {UseQueryResult<LinesByModes>} UseQueryResult - It contains the data, error, status and other query-related information based on the {@link LinesByModes} type.
 *
 * @description The fetched data is transformed and organized by TransportMode before being returned.
 */
export const useLines = (): UseQueryResult<LinesByModes> =>
  useBackendQuery<Line[], LinesByModes>(
    { path: GET_LINES_API_PATH },
    queryOptions,
  );
