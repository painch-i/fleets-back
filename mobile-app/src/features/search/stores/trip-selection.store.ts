import { create } from 'zustand';

import {
  TransportModeItem,
  transportModes,
} from '@/features/search/types/transport.types';
import { Station } from '@/features/search/types/station.types';
import { GenderConstraint } from '@/features/fleets/types/fleet.types';
import { Line } from '@/features/search/types/line.types';

type PartialITripSelectionContext = Partial<ITripSelectionContext>;

type ITripSelectionContext = {
  startStation: Station | null;
  endStation: Station | null;
  selectedTransportMode: TransportModeItem;
  departureTime: Date;
  selectedLine: Line | null;
  genderConstraint: GenderConstraint;
  gatheringDelay: number;
  fleetName: string;
  isFilled: () => boolean;
  updateStations: (selectedStation: Station) => void;
  updateFleet: (field: PartialITripSelectionContext) => void;
  swapStations: () => void;
  resetStations: () => void;
};

const GATHERING_DELAY_DEFAULT_VALUE = 5;

/**
 * Store for managing Fleet search functionality.
 *
 * @returns {ITripSelectionContext} {@link ITripSelectionContext} - The store object containing state and actions for Fleet search functionality.
 */
export const useTripSelectionStore = create<ITripSelectionContext>(
  (set, get) => {
    const isFilled = () => {
      const { selectedLine, startStation, endStation } = get();

      if (!selectedLine || !startStation || !endStation) {
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
      currentDate.setMinutes(GATHERING_DELAY_DEFAULT_VALUE + 5);
      return currentDate;
    };

    return {
      selectedTransportMode: transportModes[0],
      departureTime: initDepartureTime(),
      startStation: null,
      endStation: null,
      selectedLine: null,
      genderConstraint: GenderConstraint.NO_CONSTRAINT,
      gatheringDelay: GATHERING_DELAY_DEFAULT_VALUE,
      fleetName: '',
      isFilled,
      updateStations,
      updateFleet,
      swapStations,
      resetStations,
    };
  },
);
