import { z } from 'zod';

export const getSuggestionsBetweenStationsOptionsSchema = z.object({
  startStationId: z.string(),
  endStationId: z.string(),
});
