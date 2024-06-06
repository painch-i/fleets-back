import { z } from 'zod';

export function getGatheringDelaySchema(
  minGatheringDelay: number,
  maxGatheringDelay: number,
) {
  return z.number().int().min(minGatheringDelay).max(maxGatheringDelay);
}
