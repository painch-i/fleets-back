import { entityIdSchema } from './entity-id.schema';
import { findOptionsSchema } from './find-options.schema';

export const findByAdminOptionsSchema = findOptionsSchema.extend({
  fleetId: entityIdSchema,
  administratorId: entityIdSchema,
});
