import { StationsLine } from '@/components/StationsLine/Stations.line';
import { useTripSelectionStore } from '@/features/search/stores/trip-selection.store';
import { useQueryParam } from '@/hooks/use-query-param.hook';
import {
  MODAL_TRIP_SELECTOR_TYPE,
  SEARCH_MODAL_TYPE,
} from '@/features/search/constants/mappings';
import { TransportIcon } from '@/components/TransportIcon/Transport.icon';

const StationsCard = () => {
  const { addQueryParam } = useQueryParam(SEARCH_MODAL_TYPE.TRIP_SELECTOR);

  const [startStation, endStation, startLine, endLine] = useTripSelectionStore(
    (state) => [
      state.startStation,
      state.endStation,
      state.startLine,
      state.endLine,
    ],
  );

  const firstStation = startStation?.name || 'Station de départ';
  const secondStation = endStation?.name || "Station d'arrivée";

  return (
    <div
      className="relative flex h-[140px] w-full items-center justify-between overflow-hidden rounded-[13px] border border-solid border-border p-4"
      data-cy="stations-card"
    >
      <div className="mr-[15px] flex h-full flex-[2] flex-col">
        <div
          className="flex flex-1 items-center gap-2"
          onClick={() => addQueryParam(MODAL_TRIP_SELECTOR_TYPE.START)}
        >
          {startLine && (
            <TransportIcon
              line={startLine}
              containerClassName="aspect-square	h-8"
              variant={startLine.mode}
            />
          )}
          <p>{firstStation}</p>
        </div>
        <div className="my-2 h-px w-full bg-border" />
        <div
          className="flex flex-1 items-center gap-2"
          onClick={() => addQueryParam(MODAL_TRIP_SELECTOR_TYPE.END)}
        >
          {endLine && (
            <TransportIcon
              line={endLine}
              containerClassName="aspect-square	h-8"
              variant={endLine.mode}
            />
          )}
          <p>{secondStation}</p>
        </div>
      </div>
      <StationsLine />
    </div>
  );
};

export default StationsCard;
