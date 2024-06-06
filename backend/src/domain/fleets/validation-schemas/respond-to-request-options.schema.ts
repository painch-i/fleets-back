import { z } from 'zod';
import { entityIdSchema } from './entity-id.schema';

export const respondToRequestOptionsSchema = z.object({
  fleetId: entityIdSchema,
  userId: entityIdSchema,
  accepted: z.boolean(),
  administratorId: entityIdSchema,
});
