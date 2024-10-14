import { useTripSelectionStore } from '@/features/search/stores/trip-selection.store';
import { Station } from '@/features/search/types/station.types';

type StationPickerProps = {
  data: Station;
  index: number;
  isLastStation: boolean;
};

const StationPicker: React.FC<StationPickerProps> = ({
  data,
  index,
  isLastStation,
}) => {
  const [startStation, endStation, updateStations] = useTripSelectionStore(
    (state) => [state.startStation, state.endStation, state.updateStations],
  );

  const isSelected = startStation?.id === data.id || endStation?.id === data.id;

  const onSelectStation = () => {
    updateStations(data);
  };

  return (
    <div
      className="relative flex w-full"
      onClick={onSelectStation}
      data-cy="station-picker"
    >
      <div
        aria-selected={isSelected}
        className="invisible absolute inset-x-0 inset-y-0.5 rounded-[10px] bg-secondary/50 aria-selected:visible"
      />

      <div className="flex h-full basis-[35%] flex-col items-center justify-center">
        <div
          data-transparent={index === 0}
          className="w-1 flex-1 bg-label data-[transparent=true]:bg-transparent"
        />
        <div className="flex size-[22px] items-center justify-center rounded-full bg-label p-1">
          <div className="size-full rounded-full bg-white" />
        </div>
        <div
          data-transparent={isLastStation}
          className="w-1 flex-1 bg-label data-[transparent=true]:bg-transparent"
        />
      </div>
      <div className="flex h-full flex-1 items-center py-3.5">
        <p className="flex-1 font-medium">{data.name}</p>
      </div>
    </div>
  );
};

export default StationPicker;
