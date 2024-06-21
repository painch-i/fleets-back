import { z } from 'zod';
import { UserNetwork } from '../entities/user.types';

export const createPendingUserOptionsSchema = z.object({
  email: z
    .string()
    .email()
    // Lowercase
    .transform((value) => value.toLowerCase())
    // Trim
    .transform((value) => value.trim())
    // Remove subaddressing
    .transform((value) => value.split('+')[0]),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  network: z.nativeEnum(UserNetwork).optional(),
});
