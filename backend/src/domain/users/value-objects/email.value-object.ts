import { z } from 'zod';
import { ValueObject } from '../../_shared/value-object.interface';

const EmailSchema = z.string().email();

export class Email extends ValueObject<typeof EmailSchema> {
  getSchema() {
    return EmailSchema;
  }

  static getSchema() {
    return EmailSchema;
  }
  static fromJSON(value: any) {
    return new Email(value);
  }
}
