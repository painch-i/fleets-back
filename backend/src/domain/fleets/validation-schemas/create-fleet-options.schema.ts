import { z } from 'zod';
import { getDepartureTimeSchema } from './departure-time.schema';
import { entityIdSchema } from './entity-id.schema';
import { getGatheringDelaySchema } from './gathering-delay.schema';
import { genderConstraintConfigSchema } from './gender-constraint-config.schema';
import { originalLineTakenSchema } from './line-taken.schema';
import { variableStringSchema } from './variable-string.schema';

export type GetCreateFleetOptionsSchemaOptions = {
  minDepartureDelay: number;
  minGatheringDelay: number;
  maxGatheringDelay: number;
};

export function getCreateFleetPayloadSchema(
  options: GetCreateFleetOptionsSchemaOptions,
) {
  return z.object({
    name: variableStringSchema,
    startStationId: entityIdSchema,
    endStationId: entityIdSchema,
    departureTime: getDepartureTimeSchema(options.minDepartureDelay),
    gatheringDelay: getGatheringDelaySchema(
      options.minGatheringDelay,
      options.maxGatheringDelay,
    ),
    route: z.object({
      hash: z.string(),
      linesTaken: z.array(originalLineTakenSchema),
    }),
    genderConstraintConfig: genderConstraintConfigSchema,
  });
}

export function getCreateFleetOptionsSchema(
  options: GetCreateFleetOptionsSchemaOptions,
) {
  return getCreateFleetPayloadSchema(options).and(
    z.object({
      administratorId: entityIdSchema,
    }),
  );
}
