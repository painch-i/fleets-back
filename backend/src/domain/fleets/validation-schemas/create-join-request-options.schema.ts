import { z } from 'zod';
import { entityIdSchema } from './entity-id.schema';

export const createJoinRequestOptionsSchema = z.object({
  fleetId: entityIdSchema,
  userId: entityIdSchema,
});
