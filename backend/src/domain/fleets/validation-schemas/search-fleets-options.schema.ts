import { z } from 'zod';
import { getSearchDepartureTimeSchema } from './departure-time.schema';
import { entityIdSchema } from './entity-id.schema';

type GetSearchFleetsOptionsSchema = {
  minFormationDelay: number;
};

export function getSearchFleetsOptionsSchema(
  options: GetSearchFleetsOptionsSchema,
) {
  return z.object({
    startStationId: entityIdSchema,
    endStationId: entityIdSchema,
    departureTime: getSearchDepartureTimeSchema(options.minFormationDelay),
    searcherId: entityIdSchema,
  });
}
