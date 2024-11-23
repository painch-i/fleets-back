import { Id } from '../../types';
import IEntity from '../_shared/entity.interface';
import { LineField } from './navigation-csv-provider.interface';
import {
  LineWithOptionalRelations,
  TransportModeEnum,
  TransportSubModeEnum,
} from './navigation.types';
import { Station } from './station.entity';
import {
  transportModeEnumFromPrisma,
  transportModeEnumToPrisma,
} from './transport-mode.value-object';
import {
  transportSubModeEnumFromPrisma,
  transportSubModeEnumToPrisma,
} from './transport-sub-mode.value-object';

export type ExternalLineId = string;
export type LineId = Id;
export class Line extends IEntity {
  declare id: LineId;
  externalId: ExternalLineId;
  name: string;
  mode: TransportModeEnum;
  subMode: TransportSubModeEnum | null;
  pictoUrl: string;
  stations?: Station[];
  textColor: string;
  color: string;

  static fromCsv(lineCsv: string[]): Line {
    const line = new Line();
    line.externalId = lineCsv[LineField.ID_Line];
    line.name = lineCsv[LineField.Name_Line];
    line.mode = lineCsv[LineField.TransportMode] as TransportModeEnum;
    if (lineCsv[LineField.TransportSubMode]) {
      line.subMode = lineCsv[
        LineField.TransportSubMode
      ] as TransportSubModeEnum;
    }
    line.pictoUrl = lineCsv[LineField.Picto];
    line.textColor = lineCsv[LineField.TextColourWeb_hexa];
    line.color = lineCsv[LineField.ColourWeb_hexa];
    return line;
  }

  static fromDatabase(lineFromDatabase: LineWithOptionalRelations): Line {
    const id = lineFromDatabase.id;
    const line = new Line(id);
    line.externalId = lineFromDatabase.externalId;
    line.name = lineFromDatabase.name;
    line.mode = transportModeEnumFromPrisma[lineFromDatabase.mode];
    if (lineFromDatabase.subMode) {
      line.subMode = transportSubModeEnumFromPrisma[lineFromDatabase.subMode];
    }
    line.pictoUrl = lineFromDatabase.pictoUrl;
    if (lineFromDatabase.stations) {
      line.stations = lineFromDatabase.stations.map(Station.fromDatabase);
    }
    line.color = lineFromDatabase.color;
    line.textColor = lineFromDatabase.textColor;
    return line;
  }

  // TODO Définir le type attendu pour lineDatabase
  toDatabase(): any {
    const databaseFormat: any = {
      id: this.id,
      externalId: this.externalId,
      name: this.name,
      mode: transportModeEnumToPrisma[this.mode],
      pictoUrl: this.pictoUrl,
      color: this.color,
      textColor: this.textColor,
    };
    if (this.subMode !== null) {
      databaseFormat.subMode = transportSubModeEnumToPrisma[this.subMode];
    }
    return databaseFormat;
  }
}
