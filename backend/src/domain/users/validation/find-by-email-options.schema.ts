import { z } from 'zod';

export const findByEmailOptionsSchema = z.object({
  email: z.string().email(),
});
