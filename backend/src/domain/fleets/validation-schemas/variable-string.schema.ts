import { z } from 'zod';

export const variableStringSchema = z.string().min(1).max(255);
