import { ZodIssue } from 'zod';
import { DomainError } from './domain.error';

export type IssueCode =
  | 'email-in-use'
  | 'user-not-found'
  | 'invalid-otp'
  | 'station-not-found'
  | 'invalid-hash';

type CustomIssue = {
  code: IssueCode;
  path: (string | number)[];
  message?: string;
  [key: string]: any;
};

export type Issue = ZodIssue | CustomIssue;

export class ValidationError extends DomainError {
  issues: Issue[];
  constructor(message: string, errors: Issue[]) {
    super(message, 'VALIDATION_ERROR');
    this.issues = errors;
  }
}
