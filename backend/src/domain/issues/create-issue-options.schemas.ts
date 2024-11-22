import { z } from 'zod';
import { entityIdSchema } from '../fleets/validation-schemas/entity-id.schema';
import { IssueType } from './issues.types';

const baseCreateIssuePayload = z.object({
  type: z.nativeEnum(IssueType),
  description: z.string(),
});

const createFleetIssuePayload = baseCreateIssuePayload.extend({
  type: z.literal(IssueType.Fleet),
  targetFleetId: entityIdSchema,
});

const createUserIssuePayload = baseCreateIssuePayload.extend({
  type: z.literal(IssueType.User),
  targetUserId: entityIdSchema,
});

const createTechnicalIssuePayload = baseCreateIssuePayload.extend({
  type: z.literal(IssueType.Technical),
});

export const createIssuePayloadSchema = z.discriminatedUnion('type', [
  createFleetIssuePayload,
  createUserIssuePayload,
  createTechnicalIssuePayload,
]);

export const createIssueOptionsSchema = z.object({
  payload: createIssuePayloadSchema,
  reporterId: entityIdSchema,
});
