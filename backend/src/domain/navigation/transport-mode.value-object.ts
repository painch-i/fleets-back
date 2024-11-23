import { $Enums } from '@prisma/client';
import { TransportModeEnum } from './navigation.types';

export const transportModeEnumToPrisma: {
  [key in TransportModeEnum]: $Enums.TransportMode;
} = {
  [TransportModeEnum.BUS]: 'BUS',
  [TransportModeEnum.RAIL]: 'RAIL',
  [TransportModeEnum.METRO]: 'METRO',
  [TransportModeEnum.TRAM]: 'TRAM',
  [TransportModeEnum.FUNICULAR]: 'FUNICULAR',
};

export const transportModeEnumFromPrisma: {
  [key in $Enums.TransportMode]: TransportModeEnum;
} = {
  BUS: TransportModeEnum.BUS,
  RAIL: TransportModeEnum.RAIL,
  METRO: TransportModeEnum.METRO,
  TRAM: TransportModeEnum.TRAM,
  FUNICULAR: TransportModeEnum.FUNICULAR,
};
