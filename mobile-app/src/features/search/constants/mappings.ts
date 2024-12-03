import {
  TripSelectionContextLineFields,
  TripSelectionContextStationFields,
} from '@/features/search/stores/trip-selection.store';
import { ConstantValues } from '@/types/utils';

export const SEARCH_MODAL_TYPE = {
  TRIP_SELECTOR: 'trip-selector',
} as const;

export const MODAL_TRIP_SELECTOR_TYPE = {
  START: 'startLine',
  END: 'endLine',
} satisfies Record<string, TripSelectionContextLineFields>;

export const LINE_FIELDS_TO_STATION_FIELDS = {
  [MODAL_TRIP_SELECTOR_TYPE.START]: 'startStation',
  [MODAL_TRIP_SELECTOR_TYPE.END]: 'endStation',
} satisfies Record<
  ConstantValues<typeof MODAL_TRIP_SELECTOR_TYPE>,
  TripSelectionContextStationFields
>;
