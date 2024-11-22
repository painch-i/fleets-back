import { z } from 'zod';
import { createIssueOptionsSchema } from './create-issue-options.schemas';

export enum IssueType {
  Technical = 'technical',
  User = 'user',
  Fleet = 'fleet',
}

export type CreateIssueOptions = z.infer<typeof createIssueOptionsSchema>;
