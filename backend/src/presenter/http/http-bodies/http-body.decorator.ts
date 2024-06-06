import { Body } from '@nestjs/common';
import { ZodType } from 'zod';
import { ZodValidationPipe } from '../zod-validation.pipe';

export function ValidBody(schema: ZodType<any, any, any>) {
  return Body(new ZodValidationPipe(schema));
}
