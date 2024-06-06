import { LINE_MOCKED } from '@/__mocks__/line';
import { STATION_GGV_MOCKED, STATION_GSL_MOCKED } from '@/__mocks__/station';

import {
  Fleet,
  FleetStatus,
  GenderConstraint,
} from '@/features/fleets/types/fleet.types';

export const FLEET_MOCKED: Fleet = {
  id: '8053457a-87c1-4ab3-a16d-7a93999ccd8f',
  name: 'Fleet de',
  administratorId: '',
  members: [],
  lineId: LINE_MOCKED.id,
  line: LINE_MOCKED,
  startStationId: STATION_GGV_MOCKED.id,
  startStation: STATION_GGV_MOCKED,
  endStationId: STATION_GSL_MOCKED.id,
  endStation: STATION_GSL_MOCKED,
  gatheringTime: '2024-03-07T15:46:00.000Z',
  departureTime: '2024-03-07T15:51:00.000Z',
  genderConstraint: GenderConstraint.NO_CONSTRAINT,
  isJoinable: true,
  status: FleetStatus.FORMATION,
};
