import { TransportIconVariantProps } from '@/components/TransportIcon/Transport.icon';

export interface LineTaken {
  name: string;
  textColor: string;
  color: string;
  vehicle: Vehicle;
  nameShort: string;
}

export type RouteSuggestion = {
  hash: string;
  linesTaken: LineTaken[];
};

type Vehicle = {
  iconUri: string;
  name: { text: { text: VehicleType } };
  type: VehicleType;
};

enum VehicleType {
  SUBWAY = 'SUBWAY',
  HEAVY_RAIL = 'HEAVY_RAIL',
  BUS = 'BUS',
}

export const GoogleVehicleTypeToIDF = {
  SUBWAY: 'metro',
  HEAVY_RAIL: 'rail',
  BUS: 'bus',
} satisfies Record<VehicleType, TransportIconVariantProps['variant']>;
