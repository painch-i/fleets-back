import { ErrorCode } from './errors.types';

export class DomainError extends Error {
  name: string;
  code: ErrorCode;
  constructor(message: string, code: ErrorCode) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
  }
}
