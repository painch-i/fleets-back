import { z } from 'zod';
import { getDepartureTimeSchema } from './departure-time.schema';
import { entityIdSchema } from './entity-id.schema';
import { getGatheringDelaySchema } from './gathering-delay.schema';
import { genderConstraintConfigSchema } from './gender-constraint-config.schema';
import { lineTakenSchema } from './line-taken.schema';
import { variableStringSchema } from './variable-string.schema';

export type GetCreateFleetOptionsSchemaOptions = {
  minDepartureDelay: number;
  minGatheringDelay: number;
  maxGatheringDelay: number;
};

export function getCreateFleetOptionsSchema(
  options: GetCreateFleetOptionsSchemaOptions,
) {
  return z.object({
    name: variableStringSchema,
    administratorId: entityIdSchema,
    startStationId: entityIdSchema,
    endStationId: entityIdSchema,
    departureTime: getDepartureTimeSchema(options.minDepartureDelay),
    gatheringDelay: getGatheringDelaySchema(
      options.minGatheringDelay,
      options.maxGatheringDelay,
    ),
    route: z.object({
      hash: z.string(),
      linesTaken: z.array(lineTakenSchema),
    }),
    genderConstraintConfig: genderConstraintConfigSchema,
  });
}
