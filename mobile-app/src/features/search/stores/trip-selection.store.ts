import { create } from 'zustand';

import { Station } from '@/features/search/types/station.types';
import { GenderConstraint } from '@/features/fleets/types/fleet.types';
import { getFleetsDelays } from '@/config/delays.variables';
import { isEnvFlagTrue } from '@/utils/env';

type PartialITripSelectionContext = Partial<ITripSelectionContext>;

type ITripSelectionContext = {
  startStation: Station | null;
  endStation: Station | null;
  departureTime: Date;
  genderConstraint: GenderConstraint;
  gatheringDelay: number;
  fleetName: string;
  isFilled: () => boolean;
  updateStations: (selectedStation: Station) => void;
  updateFleet: (field: PartialITripSelectionContext) => void;
  swapStations: () => void;
  resetStations: () => void;
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

    const updateStations = (selectedStation: Station) => {
      const { startStation, endStation } = get();

      if (startStation) {
        if (startStation.id === selectedStation.id) {
          if (endStation) {
            set({ startStation: endStation, endStation: null });
            return;
          }

          set({ startStation: null });

          return;
        }

        if (endStation && endStation.id === selectedStation.id) {
          set({ endStation: null });
          return;
        }

        set({ endStation: selectedStation });
        return;
      }

      set({ startStation: selectedStation });
    };

    const swapStations = () => {
      const { startStation, endStation } = get();

      if (startStation && endStation) {
        set({ startStation: endStation, endStation: startStation });
      }
    };

    const resetStations = () => set({ startStation: null, endStation: null });

    const initDepartureTime = () => {
      const currentDate = new Date();
      currentDate.setSeconds(0);
      currentDate.setMilliseconds(0);
      currentDate.setMinutes(MIN_GATHERING_DELAY + MIN_FORMATION_DELAY);
      return currentDate;
    };

    return {
      departureTime: initDepartureTime(),
      startStation: null,
      endStation: null,
      genderConstraint: GenderConstraint.NO_CONSTRAINT,
      gatheringDelay: MIN_GATHERING_DELAY,
      fleetName: '',
      isFilled,
      updateStations,
      updateFleet,
      swapStations,
      resetStations,
    };
  },
);
