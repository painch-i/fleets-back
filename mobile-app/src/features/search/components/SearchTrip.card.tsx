import { useNavigate } from 'react-router';

import { useStationsByLine } from '@/features/search/api/use-stations-by-line.query';
import { useTripSelectionStore } from '@/features/search/stores/trip-selection.store';
import useVisibilityState from '@/hooks/use-visibility-state.hook';

import Button from '@/components/Button/Button.global';
import StationsCard from '@/features/search/components/Stations.card';
import SelectDateTimeModal from '@/features/search/components/modals/SelectDateTime.modal';
import { StationsModal } from '@/features/search/components/modals/Stations.modal';

export const SearchTripCard: React.FC = () => {
  const navigate = useNavigate();

  const {
    isOpen: isOpenStations,
    open: openStation,
    close: closeStation,
  } = useVisibilityState(false);

  const [isFilled] = useTripSelectionStore((state) => [state.isFilled]);

  // TODO -> Remove et mettre des inputs pour chercher par nom

  const {
    data: stationsData = [],
    isPending: isLoadingStations,
    isError: isErrorStations,
  } = useStationsByLine('73c71973-13c3-41c9-9020-3d1acc669d7e');

  const navigateToDestination = () => {
    navigate('/results-fleets');
  };

  return (
    <div className="relative flex w-full flex-col gap-4 rounded-2xl border border-border bg-white p-4 shadow-md-unblur shadow-black/25">
      <StationsModal
        data={stationsData}
        isLoading={isLoadingStations}
        isError={isErrorStations}
        isOpen={isOpenStations}
        onClose={closeStation}
      />
      <StationsCard openStationsModal={openStation} />
      <SelectDateTimeModal />
      <Button
        onClick={navigateToDestination}
        disabled={!isFilled()}
        className="!rounded-[13px]"
      >
        Rechercher
      </Button>
    </div>
  );
};
