import { entityIdSchema } from './entity-id.schema';
import { findOptionsSchema } from './find-options.schema';

export const findByIdOptionsSchema = findOptionsSchema.extend({
  memberId: entityIdSchema.optional(),
  administratorId: entityIdSchema.optional(),
  fleetId: entityIdSchema.optional(),
});
