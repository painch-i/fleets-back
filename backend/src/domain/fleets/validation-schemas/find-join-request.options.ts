import { z } from 'zod';
import { entityIdSchema } from './entity-id.schema';

export const findJoinRequestOptionsSchema = z.object({
  fleetId: entityIdSchema,
  administratorId: entityIdSchema.optional(),
  userId: entityIdSchema.optional(),
});
