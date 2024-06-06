import { z } from 'zod';

export class SendFleetMessageMessageBody {
  fleetId: string;
  content: string;
}

export const SendFleetMessageMessageBodySchema = z.object({
  fleetId: z.string(),
  content: z.string(),
});
