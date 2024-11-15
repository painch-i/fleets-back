import { z } from 'zod';
import { entityIdSchema } from '../fleets/validation-schemas/entity-id.schema';
import { IssueType } from './issues-service.interface';

export const baseIssueSchema = z.object({
  type: z.nativeEnum(IssueType),
  description: z.string(),
  reportedBy: entityIdSchema,
  createdAt: z.date(),
});

export const technicalIssueSchema = baseIssueSchema.extend({
  type: z.literal(IssueType.Technical),
});

export const userIssueSchema = baseIssueSchema.extend({
  type: z.literal(IssueType.User),
  targetUserId: entityIdSchema,
});

export const fleetIssueSchema = baseIssueSchema.extend({
  type: z.literal(IssueType.Fleet),
  targetFleetId: entityIdSchema,
});

export const createIssueOptionsSchema = z.discriminatedUnion('type', [
  technicalIssueSchema,
  userIssueSchema,
  fleetIssueSchema,
]);

export type CreateIssueOptions = z.infer<typeof createIssueOptionsSchema>;

export type BaseIssue = z.infer<typeof baseIssueSchema>;
