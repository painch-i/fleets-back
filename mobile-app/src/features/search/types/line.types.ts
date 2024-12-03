import { Station } from '@/features/search/types/station.types';
import {
  TransportMode,
  TransportSubMode,
} from '@/features/search/types/transport.types';
import { ID } from '@/types/utils';

export type LineID = ID;
export type ExternalLineId = string;

export interface Line {
  id: LineID;
  externalId: ExternalLineId;
  name: string;
  mode: TransportMode;
  subMode: TransportSubMode | null;
  stations?: Station[];
  textColor: string;
  color: string;
}

export type LinesByModes = Record<TransportMode, Line[]>;
