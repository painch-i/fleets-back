import { FLEET_MOCKED } from '@/__mocks__/fleet';

import {
  Fleet,
  FleetIntermediateStatus,
  FleetStatus,
} from '@/features/fleets/types/fleet.types';
import { addHoursToDate } from '@/utils/date';
import { getCountDown, getFleetIntermediateStatus } from '@/utils/fleet';

describe('Utils | fleet | getFleetIntermediateStatus', () => {
  it('should return the same status when countdown is not 00:00', () => {
    const initialStatus = FleetStatus.GATHERING;
    const initialCountdown = '00:10';

    expect(getFleetIntermediateStatus(initialStatus, initialCountdown)).toEqual(
      initialStatus,
    );
  });

  describe('When coutdown is 00:00', () => {
    it('should return WAITING_ON_GATHERING when status is FORMATION', () => {
      const initialStatus = FleetStatus.FORMATION;
      const initialCountdown = '00:00';

      const expectedOutput = FleetIntermediateStatus.WAITING_ON_GATHERING;

      expect(
        getFleetIntermediateStatus(initialStatus, initialCountdown),
      ).toEqual(expectedOutput);
    });

    it('should return WAITING_ON_GATHERING when status is GATHERING', () => {
      const initialStatus = FleetStatus.GATHERING;
      const initialCountdown = '00:00';

      const expectedOutput = FleetIntermediateStatus.WAITING_ON_TRAVELING;

      expect(
        getFleetIntermediateStatus(initialStatus, initialCountdown),
      ).toEqual(expectedOutput);
    });
  });
});

describe('Utils | fleet | getCountDown', () => {
  describe('When the fleet is in FORMATION', () => {
    it('should return the coutdown based on the gatheringTime', () => {
      const initialFleet: Fleet = {
        ...FLEET_MOCKED,
        gatheringTime: addHoursToDate(new Date(), 1).toISOString(),
      };

      const expectedOutput = '01:00:00';

      expect(getCountDown(initialFleet)).toEqual(expectedOutput);
    });
  });

  describe('When the fleet is in GATHERING', () => {
    it('should return the coutdown based on the departureTime', () => {
      const initialFleet: Fleet = {
        ...FLEET_MOCKED,
        status: FleetStatus.GATHERING,
        departureTime: addHoursToDate(new Date(), 1).toISOString(),
      };

      const expectedOutput = '01:00:00';

      expect(getCountDown(initialFleet)).toEqual(expectedOutput);
    });
  });
});
