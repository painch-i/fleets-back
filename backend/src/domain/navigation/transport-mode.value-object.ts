import { TransportMode as DatabaseTransportMode } from '@prisma/client';
import { z } from 'zod';
import { ValueObject } from '../_shared/value-object.interface';

export enum TransportModeEnum {
  BUS = 'bus',
  RAIL = 'rail',
  METRO = 'metro',
  TRAM = 'tram',
  FUNICULAR = 'funicular',
}

type TransportModeType = `${TransportModeEnum}`;

const schema = z.nativeEnum(TransportModeEnum);

export class TransportMode extends ValueObject<typeof schema> {
  constructor(value: TransportModeType) {
    super(value as TransportModeEnum);
  }
  getSchema() {
    return schema;
  }

  static getSchema() {
    return schema;
  }

  toDatabase(): DatabaseTransportMode {
    return databaseModeByEnum[this.getValue()];
  }

  static fromDatabase(databaseTransportMode: DatabaseTransportMode) {
    return new TransportMode(enumByDatabaseMode[databaseTransportMode]);
  }
}
const databaseModeByEnum: {
  [key in TransportModeEnum]: DatabaseTransportMode;
} = {
  [TransportModeEnum.BUS]: 'BUS',
  [TransportModeEnum.RAIL]: 'RAIL',
  [TransportModeEnum.METRO]: 'METRO',
  [TransportModeEnum.TRAM]: 'TRAM',
  [TransportModeEnum.FUNICULAR]: 'FUNICULAR',
};

const enumByDatabaseMode: {
  [key in DatabaseTransportMode]: TransportModeEnum;
} = {
  BUS: TransportModeEnum.BUS,
  RAIL: TransportModeEnum.RAIL,
  METRO: TransportModeEnum.METRO,
  TRAM: TransportModeEnum.TRAM,
  FUNICULAR: TransportModeEnum.FUNICULAR,
};
