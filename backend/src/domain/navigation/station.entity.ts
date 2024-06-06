import { Prisma } from '@prisma/client';
import { CsvLineRow } from '../../infrastructure/repositories/navigation-csv.repository';
import IEntity from '../_shared/entity.interface';
import { Line } from './line.entity';
import { StationField } from './navigation-csv-provider.interface';
import { StationWithOptionalRelations } from './navigation.types';

export class Station extends IEntity {
  externalId: string;
  name: string;
  lines?: Line[];
  latitude: number;
  longitude: number;

  static fromDatabase(stationFromDb: StationWithOptionalRelations): Station {
    const id = stationFromDb.id;
    const station = new Station(id);
    station.externalId = stationFromDb.externalId;
    station.name = stationFromDb.name;
    station.latitude = stationFromDb.latitude;
    station.longitude = stationFromDb.longitude;
    if (stationFromDb.lines) {
      station.lines = stationFromDb.lines.map(Line.fromDatabase);
    }
    return station;
  }

  static fromCsv(stationCsv: CsvLineRow): Station {
    const station = new Station();
    const lineExternalIdIdSplit = stationCsv[StationField.route_id].split(':');
    station.externalId = stationCsv[StationField.stop_id];
    station.name = stationCsv[StationField.stop_name];
    const line = new Line();
    line.externalId = lineExternalIdIdSplit[lineExternalIdIdSplit.length - 1];
    station.lines = [line];
    station.latitude = Number(stationCsv[StationField.stop_lat]);
    station.longitude = Number(stationCsv[StationField.stop_lon]);
    return station;
  }

  // TODO Définir le type attendu pour stationDatabase
  toDatabase(): Prisma.StationCreateInput {
    let lines: Prisma.LineCreateNestedManyWithoutStationsInput | undefined;
    if (this.lines) {
      const linesConnect: Prisma.LineWhereUniqueInput[] = this.lines.map(
        (line) => ({
          externalId: line.externalId,
        }),
      );
      lines = {
        connect: linesConnect,
      };
    }

    return {
      id: this.id,
      externalId: this.externalId,
      name: this.name,
      lines,
      latitude: this.latitude,
      longitude: this.longitude,
    };
  }
}
