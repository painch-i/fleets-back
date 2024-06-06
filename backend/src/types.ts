import { z } from 'zod';
import { entityIdSchema } from './domain/fleets/validation-schemas/entity-id.schema';

export type Id = z.infer<typeof entityIdSchema>;
