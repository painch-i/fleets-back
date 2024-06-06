import { Prisma } from '@prisma/client';
import { Id } from '../../types';
import { Line, LineId } from './line.entity';
import { Station } from './station.entity';

export interface INavigationRepository {
  getLines(include?: Prisma.LineInclude): Promise<Line[]>;
  getStations(lineId?: LineId): Promise<Station[]>;
  upsertManyLines(lines: Line[]): Promise<void>;
  upsertManyStations(stations: Station[]): Promise<void>;
  findStationsByIds(ids: Id[]): Promise<Station[]>;
}
