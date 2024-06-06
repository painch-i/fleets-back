import { z } from 'zod';
import { entityIdSchema } from './entity-id.schema';

export const getFleetOptionsSchema = z.object({
  userId: entityIdSchema.optional(),
  fleetId: entityIdSchema.optional(),
});
