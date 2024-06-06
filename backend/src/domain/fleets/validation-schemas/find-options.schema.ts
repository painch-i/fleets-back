import { z } from 'zod';
import { FleetStatus } from '../fleets.types';

export const findOptionsSchema = z.object({
  status: z.nativeEnum(FleetStatus).optional(),
  includeEnded: z.boolean().optional(),
});
