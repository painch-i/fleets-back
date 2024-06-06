import { z } from 'zod';
import { ValueObject } from '../../_shared/value-object.interface';

// TODO: Enforce password complexity
const clearPasswordSchema = z.string().min(8);

export class ClearPassword extends ValueObject<typeof clearPasswordSchema> {
  constructor(value: string) {
    super(value);
  }

  getSchema() {
    return clearPasswordSchema;
  }

  static getSchema() {
    return clearPasswordSchema;
  }
}
