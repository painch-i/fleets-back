import { z } from 'zod';
import { OTP_CODE_LENGTH } from '../../../config/config-variables';
import { emailSchema } from '../../_shared/validation/email.schema';

export const verifyOTPOptionsSchema = z.object({
  email: emailSchema,
  otp: z.string().length(OTP_CODE_LENGTH).openapi({
    type: 'string',
    minLength: OTP_CODE_LENGTH,
    maxLength: OTP_CODE_LENGTH,
    example: '123456',
  }),
});
