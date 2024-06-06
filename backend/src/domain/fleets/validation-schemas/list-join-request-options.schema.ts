import { z } from 'zod';
import { entityIdSchema } from './entity-id.schema';

export const listJoinRequestOptionsSchema = z.object({
  fleetId: entityIdSchema,
  administratorId: entityIdSchema,
  userId: entityIdSchema.optional(),
});
