import { Id } from '../../types';
import IEntity from '../_shared/entity.interface';
import { LineField } from './navigation-csv-provider.interface';
import { LineWithOptionalRelations } from './navigation.types';
import { Station } from './station.entity';
import { TransportMode } from './transport-mode.value-object';
import { TransportSubMode } from './transport-sub-mode.value-object';

export type ExternalLineId = string;
export type LineId = Id;
export class Line extends IEntity {
  id: LineId;
  externalId: ExternalLineId;
  name: string;
  mode: TransportMode;
  subMode: TransportSubMode | null = null;
  pictoUrl: string;
  stations?: Station[];
  textColor: string;
  color: string;

  static fromCsv(lineCsv: string[]): Line {
    const line = new Line();
    line.externalId = lineCsv[LineField.ID_Line];
    line.name = lineCsv[LineField.Name_Line];
    line.mode = new TransportMode(lineCsv[LineField.TransportMode] as any);
    if (lineCsv[LineField.TransportSubMode]) {
      line.subMode = new TransportSubMode(
        lineCsv[LineField.TransportSubMode] as any,
      );
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
    line.mode = TransportMode.fromDatabase(lineFromDatabase.mode);
    if (lineFromDatabase.subMode) {
      line.subMode = TransportSubMode.fromDatabase(lineFromDatabase.subMode);
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
      mode: this.mode.toDatabase(),
      pictoUrl: this.pictoUrl,
      color: this.color,
      textColor: this.textColor,
    };
    if (this.subMode !== null) {
      databaseFormat.subMode = this.subMode.toDatabase();
    }
    return databaseFormat;
  }
}
