import { IconType } from 'react-icons';
import { FaSubway, FaTrain, FaTram } from 'react-icons/fa';

export enum TransportMode {
  RAIL = 'rail',
  METRO = 'metro',
  TRAM = 'tram',
  // BUS = 'bus',
  // FUNICULAR = 'funicular',
}

export enum TransportSubMode {
  REGIONAL_RAIL = 'regionalRail',
  SUBURBAN_RAILWAY = 'suburbanRailway',
  LOCAL = 'local',
  RAIL_SHUTTLE = 'railShuttle',
}

export type TransportModeItem = {
  name: string;
  subname: TransportMode;
  icon: IconType;
};

export const transportModes: TransportModeItem[] = [
  { name: 'Train', subname: TransportMode.RAIL, icon: FaTrain },
  { name: 'Metro', subname: TransportMode.METRO, icon: FaSubway },
  { name: 'Tram', subname: TransportMode.TRAM, icon: FaTram },
];
