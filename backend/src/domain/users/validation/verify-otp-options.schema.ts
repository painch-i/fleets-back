import { z } from 'zod';
import { OTP_CODE_LENGTH } from '../../../config/config-variables';

export const verifyOTPOptionsSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(OTP_CODE_LENGTH),
});
