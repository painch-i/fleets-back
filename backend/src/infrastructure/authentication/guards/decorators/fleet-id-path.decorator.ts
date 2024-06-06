import { SetMetadata } from '@nestjs/common';
export const FleetIdMetadataKey = 'fleetIdPath';
export const FleetIdPath = (path: string) =>
  SetMetadata(FleetIdMetadataKey, path);
