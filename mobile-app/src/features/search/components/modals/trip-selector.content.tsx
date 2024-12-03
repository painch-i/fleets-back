import { createElement, useState } from 'react';
import { IonSpinner } from '@ionic/react';

import ErrorMessage from '@/components/ErrorMessage/Error.message';
import { useLines } from '@/features/search/api/use-lines.query';
import { TransportMode } from '@/features/search/types/transport.types';
import {
  TRANSPORT_MODE,
  TRANSPORT_MODE_ICONS,
} from '@/features/search/constants/mappings.transport';
import { TransportIcon } from '@/components/TransportIcon/Transport.icon';
import { useStationsByLine } from '@/features/search/api/use-stations-by-line.query';
import StationPicker from '@/features/search/components/Station.picker';
import {
  TripSelectionContextLineFields,
  useTripSelectionStore,
} from '@/features/search/stores/trip-selection.store';
import { Line } from '@/features/search/types/line.types';
import { useQueryParam } from '@/hooks/use-query-param.hook';
import {
  LINE_FIELDS_TO_STATION_FIELDS,
  MODAL_TRIP_SELECTOR_TYPE,
  SEARCH_MODAL_TYPE,
} from '@/features/search/constants/mappings';

const TRANSPORT_MODE_VALUES = Object.values(TRANSPORT_MODE);

export const TripSelectorLines = () => {
  const { value = MODAL_TRIP_SELECTOR_TYPE.START } = useQueryParam(
    SEARCH_MODAL_TYPE.TRIP_SELECTOR,
  );

  const currentModalValue = value as TripSelectionContextLineFields;

  const [lineSelected, updateFleet] = useTripSelectionStore((state) => [
    state[currentModalValue],
    state.updateFleet,
  ]);

  const { data: linesByMode, isLoading, isError } = useLines();

  const [currentTransportMode, setCurrentTransportMode] =
    useState<TransportMode>(lineSelected?.mode || TRANSPORT_MODE.RAIL);

  function handleOnChangeTransportMode(value: TransportMode): void {
    setCurrentTransportMode(value);
    updateFleet({
      [currentModalValue]: null,
      [LINE_FIELDS_TO_STATION_FIELDS[currentModalValue]]: null,
    });
  }

  function handleLineSelection(line: Line): void {
    updateFleet({
      [value]: line,
      [LINE_FIELDS_TO_STATION_FIELDS[currentModalValue]]: null,
    });
  }

  const linesByCurrentTransportMode = linesByMode?.[currentTransportMode] || [];

  return (
    <>
      <div className="flex justify-center gap-8">
        {TRANSPORT_MODE_VALUES.map((transportMode, index) => (
          <div
            aria-selected={currentTransportMode === transportMode}
            className="flex flex-col items-center justify-center gap-2.5 rounded-[15px] bg-border p-3.5 aria-selected:bg-secondary"
            onClick={() => handleOnChangeTransportMode(transportMode)}
            key={index}
          >
            {createElement(TRANSPORT_MODE_ICONS[transportMode], {
              size: '20px',
            })}
            <p className="text-[10px] font-bold capitalize">{transportMode}</p>
          </div>
        ))}
      </div>
      <div className="relative grid h-full min-h-48 flex-1 grid-cols-[repeat(auto-fill,_minmax(60px,_1fr))] gap-3.5 overflow-y-auto rounded-[10px] bg-light p-2.5">
        {isLoading && (
          <IonSpinner className="absolute left-[42%] size-14 self-center" />
        )}

        {isError && (
          <ErrorMessage
            className="absolute left-2/4 top-[40%] w-[95%] -translate-x-2/4 translate-y-[-40%]"
            message="Erreur lors de la récupération des lignes"
          />
        )}

        {!isLoading &&
          !isError &&
          linesByCurrentTransportMode.map((line) => (
            <TransportIcon
              aria-selected={lineSelected?.id === line.id}
              line={line}
              onClick={() => handleLineSelection(line)}
              containerClassName="h-[50px] w-[50px] m-auto overflow-hidden p-0 aria-selected:border-2 aria-selected:border-black"
              variant={line.mode}
              key={line.externalId}
            />
          ))}
      </div>
    </>
  );
};

export const TripSelectorStations = () => {
  const { value = MODAL_TRIP_SELECTOR_TYPE.START } = useQueryParam(
    SEARCH_MODAL_TYPE.TRIP_SELECTOR,
  );

  const currentModalValue = value as TripSelectionContextLineFields;

  const [line, updateFleet] = useTripSelectionStore((state) => [
    state[currentModalValue],
    state.updateFleet,
  ]);

  const {
    data: stations = [],
    isLoading,
    isError,
  } = useStationsByLine(line?.id);

  return (
    <div className="flex h-full flex-1 flex-col overflow-x-scroll rounded-xl bg-light p-1">
      {isLoading && <IonSpinner className="m-auto size-12" />}

      {isError && <ErrorMessage />}

      {!isLoading &&
        !isError &&
        stations.map((station, index) => (
          <StationPicker
            key={station.id}
            index={index}
            isLastStation={stations.length === index + 1}
            data={station}
          />
        ))}
    </div>
  );
};
