import { PipeTransform } from '@nestjs/common';
import { ZodType } from 'zod';
import { HttpValidationException } from './errors/validation.error';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType<any, any, any>) {}

  transform(value: unknown) {
    try {
      this.schema.parse(value);
    } catch (error) {
      throw new HttpValidationException(error);
    }
    return value;
  }
}
