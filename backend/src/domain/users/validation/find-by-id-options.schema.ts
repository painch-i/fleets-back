import { z } from 'zod';
import { generateId } from '../../../utils';
import { entityIdSchema } from '../../fleets/validation-schemas/entity-id.schema';

export const findUserByIdOptionsSchema = z.object({
  id: entityIdSchema.openapi({
    description: 'The id of the user',
    example: generateId(),
  }),
});
