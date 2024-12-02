import { z } from 'zod';
import { entityIdSchema } from './entity-id.schema';

export const removeMemberPayloadSchema = z.object({
  memberId: entityIdSchema,
});

export const removeMemberOptionsSchema = z.object({
  removePayload: removeMemberPayloadSchema,
  fleetId: entityIdSchema,
  callerId: entityIdSchema,
});
