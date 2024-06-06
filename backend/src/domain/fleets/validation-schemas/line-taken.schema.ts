import { z } from 'zod';

export const lineTakenSchema = z.object({
  name: z.string(),
  color: z.string(),
  nameShort: z.string(),
  textColor: z.string().regex(/^#[0-9a-f]{6}$/),
  vehicle: z
    .object({
      name: z
        .object({
          text: z.object({
            text: z.string(),
          }),
        })
        .optional(),
      type: z.string(),
      iconUri: z.string(),
    })
    .optional(),
});
