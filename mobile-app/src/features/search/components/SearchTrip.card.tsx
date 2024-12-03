import { useNavigate } from 'react-router';

import { useTripSelectionStore } from '@/features/search/stores/trip-selection.store';

import Button from '@/components/Button/Button.global';
import StationsCard from '@/features/search/components/Stations.card';
import SelectDateTimeModal from '@/features/search/components/modals/SelectDateTime.modal';

export const SearchTripCard: React.FC = () => {
  const navigate = useNavigate();

  const [isFilled] = useTripSelectionStore((state) => [state.isFilled]);

  function navigateToDestination() {
    navigate('/results-fleets');
  }

  return (
    <div className="relative flex w-full flex-col gap-4 rounded-2xl border border-border bg-white p-4 shadow-md-unblur shadow-black/25">
      <StationsCard />
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
