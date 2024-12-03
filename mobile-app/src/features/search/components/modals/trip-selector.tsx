import ModalBase from '@/components/Modal/base';

import {
  TripSelectorLines,
  TripSelectorStations,
} from '@/features/search/components/modals/trip-selector.content';
import { useQueryParam } from '@/hooks/use-query-param.hook';
import {
  TripSelectionContextLineFields,
  useTripSelectionStore,
} from '@/features/search/stores/trip-selection.store';
import {
  LINE_FIELDS_TO_STATION_FIELDS,
  MODAL_TRIP_SELECTOR_TYPE,
  SEARCH_MODAL_TYPE,
} from '@/features/search/constants/mappings';

export const TripSelectorModal = () => {
  const { exist, value = MODAL_TRIP_SELECTOR_TYPE.START } = useQueryParam(
    SEARCH_MODAL_TYPE.TRIP_SELECTOR,
  );

  const currentModalValue = value as TripSelectionContextLineFields;
  const currentStationType = LINE_FIELDS_TO_STATION_FIELDS[currentModalValue];

  const [station, updateFleet] = useTripSelectionStore((state) => [
    state[currentStationType],
    state.updateFleet,
  ]);

  if (!exist) return null;

  function onWillDismissModal(): void {
    if (station) return;

    updateFleet({ [currentModalValue]: null });
  }

  return (
    <ModalBase
      onWillDismiss={onWillDismissModal}
      modalKey={SEARCH_MODAL_TYPE.TRIP_SELECTOR}
      containerClassName="part-[content]:h-3/4"
    >
      <TripSelectorLines />
      <TripSelectorStations />
    </ModalBase>
  );
};
