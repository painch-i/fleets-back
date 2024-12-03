import { IconType } from 'react-icons';
import { FaTrain, FaSubway, FaTram } from 'react-icons/fa';

import { ConstantValues } from '@/types/utils';

export const TRANSPORT_MODE = {
  RAIL: 'rail',
  METRO: 'metro',
  TRAM: 'tram',
  // BUS: 'bus',
  // FUNICULAR: 'funicular',
} as const;

export const TRANSPORT_SUB_MODE = {
  REGIONAL_RAIL: 'regionalRail',
  SUBURBAN_RAILWAY: 'suburbanRailway',
  LOCAL: 'local',
  RAIL_SHUTTLE: 'railShuttle',
} as const;

export const TRANSPORT_MODE_ICONS = {
  [TRANSPORT_MODE.RAIL]: FaTrain,
  [TRANSPORT_MODE.METRO]: FaSubway,
  [TRANSPORT_MODE.TRAM]: FaTram,
} satisfies Record<ConstantValues<typeof TRANSPORT_MODE>, IconType>;
