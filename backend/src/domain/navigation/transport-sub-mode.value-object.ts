import { $Enums } from '@prisma/client';
import { TransportSubModeEnum } from './navigation.types';

export const transportSubModeEnumToPrisma: {
  [key in TransportSubModeEnum]: $Enums.TransportSubMode;
} = {
  [TransportSubModeEnum.REGIONAL_RAIL]: 'REGIONAL_RAIL',
  [TransportSubModeEnum.SUBURBAN_RAILWAY]: 'SUBURBAN_RAILWAY',
  [TransportSubModeEnum.LOCAL]: 'LOCAL',
  [TransportSubModeEnum.RAIL_SHUTTLE]: 'RAIL_SHUTTLE',
};

export const transportSubModeEnumFromPrisma: {
  [key in $Enums.TransportSubMode]: TransportSubModeEnum;
} = {
  REGIONAL_RAIL: TransportSubModeEnum.REGIONAL_RAIL,
  SUBURBAN_RAILWAY: TransportSubModeEnum.SUBURBAN_RAILWAY,
  LOCAL: TransportSubModeEnum.LOCAL,
  RAIL_SHUTTLE: TransportSubModeEnum.RAIL_SHUTTLE,
};
