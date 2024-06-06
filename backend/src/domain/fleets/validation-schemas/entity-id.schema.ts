import { z } from 'zod';

export const entityIdSchema = z.string().uuid();
