import { z } from 'zod';

export const setNotificationTokenPayloadSchema = z
  .object({
    token: z.string(),
  })
  .strip();

export const setNotificationTokenOptionsSchema = z.object({
  updatedUserId: z.string().uuid(),
  updatePayload: setNotificationTokenPayloadSchema,
});
