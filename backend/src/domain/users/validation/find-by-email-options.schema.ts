import { z } from 'zod';
import { emailSchema } from '../../_shared/validation/email.schema';

export const findUserByEmailOptionsSchema = z.object({
  email: emailSchema,
});
