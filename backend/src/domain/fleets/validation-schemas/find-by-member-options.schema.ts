import { entityIdSchema } from './entity-id.schema';
import { findOptionsSchema } from './find-options.schema';

export const findByMemberAndAdminOptionsSchema = findOptionsSchema.extend({
  fleetId: entityIdSchema,
  memberId: entityIdSchema,
  administratorId: entityIdSchema.optional(),
});
