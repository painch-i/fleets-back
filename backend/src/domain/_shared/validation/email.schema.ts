import { z } from 'zod';

export const emailSchema = z.string().email().openapi({
  description: 'The email of the user',
  example: 'painch_i@etna-alternance.net',
});
