import { create } from 'zustand';

import { getFleetsDelays } from '@/config/delays.variables';
import { GenderConstraint } from '@/features/fleets/types/fleet.types';
import { Line } from '@/features/search/types/line.types';
import { Station } from '@/features/search/types/station.types';
import { isEnvFlagTrue } from '@/utils/env';

export type TripSelectionContextStationFields = Extract<
  keyof ITripSelectionContext,
  'startStation' | 'endStation'
>;

export type TripSelectionContextLineFields = Extract<
  keyof ITripSelectionContext,
  'startLine' | 'endLine'
>;

type PartialITripSelectionContext = Partial<ITripSelectionContext>;

type ITripSelectionContext = {
  startLine: Line | null;
  endLine: Line | null;
  startStation: Station | null;
  endStation: Station | null;
  departureTime: Date;
  genderConstraint: GenderConstraint;
  gatheringDelay: number;
  fleetName: string;
  isFilled: () => boolean;
  updateFleet: (field: PartialITripSelectionContext) => void;
  swapStations: () => void;
};

const { MIN_FORMATION_DELAY, MIN_GATHERING_DELAY } = getFleetsDelays(
  isEnvFlagTrue('VITE_USE_SHORT_DELAYS'),
);

/**
 * Store for managing Fleet search functionality.
 *
 * @returns {ITripSelectionContext} {@link ITripSelectionContext} - The store object containing state and actions for Fleet search functionality.
 */
export const useTripSelectionStore = create<ITripSelectionContext>(
  (set, get) => {
    const isFilled = () => {
      const { startStation, endStation } = get();

      if (!startStation || !endStation) {
        return false;
      }
      return true;
    };

    const updateFleet = (newFleetData: PartialITripSelectionContext) => {
      set(newFleetData);
    };

    const swapStations = () => {
      const { startStation, endStation, startLine, endLine } = get();

      set({
        startStation: endStation,
        startLine: endLine,
        endStation: startStation,
        endLine: startLine,
      });
    };

    const initDepartureTime = () => {
      const currentDate = new Date();
      currentDate.setSeconds(0);
      currentDate.setMilliseconds(0);
      currentDate.setMinutes(MIN_GATHERING_DELAY + MIN_FORMATION_DELAY);
      return currentDate;
    };

    return {
      departureTime: initDepartureTime(),
      startLine: null,
      endLine: null,
      startStation: null,
      endStation: null,
      genderConstraint: GenderConstraint.NO_CONSTRAINT,
      gatheringDelay: MIN_GATHERING_DELAY,
      fleetName: '',
      isFilled,
      updateFleet,
      swapStations,
    };
  },
);
