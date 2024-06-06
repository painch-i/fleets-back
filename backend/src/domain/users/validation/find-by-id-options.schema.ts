import { z } from 'zod';
import { entityIdSchema } from '../../fleets/validation-schemas/entity-id.schema';

export const findByIdOptionsSchema = z.object({
  id: entityIdSchema,
});
