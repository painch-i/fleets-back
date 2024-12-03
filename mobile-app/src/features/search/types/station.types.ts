import { Line } from '@/features/search/types/line.types';
import { ID } from '@/types/utils';

export type StationID = ID;
export type ExternalStationId = string;

export interface Station {
  id: StationID;
  externalId: ExternalStationId;
  name: string;
  lines?: Line[];
  latitude: number;
  longitude: number;
}
