import { StationsLine } from '@/components/StationsLine/Stations.line';
import { useTripSelectionStore } from '@/features/search/stores/trip-selection.store';

type StationsPickerOptions = {
  openStationsModal: () => void;
};

const StationsCard: React.FC<StationsPickerOptions> = ({
  openStationsModal,
}) => {
  const [startStation, endStation] = useTripSelectionStore((state) => [
    state.startStation,
    state.endStation,
  ]);

  const firstStation = startStation?.name || 'Station de départ';
  const secondStation = endStation?.name || "Station d'arrivée";

  return (
    <div
      className="relative flex h-[130px] w-full items-center justify-between overflow-hidden rounded-[13px] border border-solid border-border p-4"
      onClick={openStationsModal}
      data-cy="stations-card"
    >
      <div className="mr-[15px] flex h-full flex-[2] flex-col justify-evenly">
        <p>{firstStation}</p>
        <div className="my-2 h-px w-full bg-border" />
        <p>{secondStation}</p>
      </div>
      <StationsLine />
    </div>
  );
};

export default StationsCard;
