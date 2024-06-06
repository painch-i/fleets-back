import { TransportSubMode as DatabaseTransportSubMode } from '@prisma/client';
import { z } from 'zod';
import { ValueObject } from '../_shared/value-object.interface';

export enum TransportSubModeEnum {
  REGIONAL_RAIL = 'regionalRail',
  SUBURBAN_RAILWAY = 'suburbanRailway',
  LOCAL = 'local',
  RAIL_SHUTTLE = 'railShuttle',
}

type TransportSubModeType = `${TransportSubModeEnum}`;

const schema = z.nativeEnum(TransportSubModeEnum);

export class TransportSubMode extends ValueObject<typeof schema> {
  constructor(value: TransportSubModeType) {
    super(value as TransportSubModeEnum);
  }
  getSchema() {
    return schema;
  }

  static getSchema() {
    return schema;
  }

  toDatabase(): DatabaseTransportSubMode {
    return databaseSubModeByEnum[this.getValue()];
  }

  static fromDatabase(databaseTransportSubMode: DatabaseTransportSubMode) {
    return new TransportSubMode(
      enumByDatabaseSubMode[databaseTransportSubMode],
    );
  }
}

const databaseSubModeByEnum: {
  [key in TransportSubModeEnum]: DatabaseTransportSubMode;
} = {
  [TransportSubModeEnum.REGIONAL_RAIL]: 'REGIONAL_RAIL',
  [TransportSubModeEnum.SUBURBAN_RAILWAY]: 'SUBURBAN_RAILWAY',
  [TransportSubModeEnum.LOCAL]: 'LOCAL',
  [TransportSubModeEnum.RAIL_SHUTTLE]: 'RAIL_SHUTTLE',
};

const enumByDatabaseSubMode: {
  [key in DatabaseTransportSubMode]: TransportSubModeEnum;
} = {
  REGIONAL_RAIL: TransportSubModeEnum.REGIONAL_RAIL,
  SUBURBAN_RAILWAY: TransportSubModeEnum.SUBURBAN_RAILWAY,
  LOCAL: TransportSubModeEnum.LOCAL,
  RAIL_SHUTTLE: TransportSubModeEnum.RAIL_SHUTTLE,
};
