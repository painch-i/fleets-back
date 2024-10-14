import { IonDatetimeButton } from '@ionic/react';
import { useQueryClient } from '@tanstack/react-query';
import { FC, HTMLAttributes, useState } from 'react';
import { FaRegCalendar, FaRunning, FaTrain } from 'react-icons/fa';

import { BottomSheetRoot } from '@/components/BottomSheet/Bottom.sheet';
import Button from '@/components/Button/Button.global';
import DatetimeModal from '@/components/DatetimeModal/Datetime.modal';
import Input from '@/components/Input/Input.global';
import LinesRow from '@/components/Line/Lines.row';
import { StationsLine } from '@/components/StationsLine/Stations.line';
import { getFleetsDelays } from '@/config/delays.variables';
import { useCurrentUser } from '@/features/auth/providers/current-user.provider';
import { useCreateFleetMutation } from '@/features/fleets/api/create-fleet.mutation';
import { FLEETS_API_PATH } from '@/features/fleets/api/current-fleet.query';
import {
  GenderConstraint,
  GenderConstraintCreationConfig,
} from '@/features/fleets/types/fleet.types';
import { useRouteSuggestionsQuery } from '@/features/search/api/use-route-suggestions.query';
import { useTripSelectionStore } from '@/features/search/stores/trip-selection.store';
import { RouteSuggestion } from '@/features/search/types/suggestion.types';
import useFlag from '@/hooks/use-flag.hook';
import { GlobalModalOptions } from '@/types';
import { formatDateToString } from '@/utils/date';
import { cn } from '@/utils/lib';
import { getUserDisplayName } from '@/utils/user';

interface RowContainerType extends FC<HTMLAttributes<HTMLDivElement>> {
  Title: FC<HTMLAttributes<HTMLDivElement>>;
}

const RowContainer: RowContainerType = ({ children, className }) => (
  <div
    className={cn('flex w-full items-center gap-2.5 py-1.5 pr-0.5', className)}
  >
    {children}
  </div>
);

const RowContainerTitle: FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
}) => <p className="whitespace-nowrap text-base font-bold">{children}</p>;

RowContainer.Title = RowContainerTitle;

const CreateFleetModal = ({ isOpen, onClose }: GlobalModalOptions) => {
  const {
    MIN_FORMATION_DELAY,
    MIN_GATHERING_DELAY,
    MID_GATHERING_DELAY,
    MAX_GATHERING_DELAY,
  } = getFleetsDelays(useFlag('USE_SHORT_DELAYS'));

  const gatheringDelayOptions = [
    MIN_GATHERING_DELAY,
    MID_GATHERING_DELAY,
    MAX_GATHERING_DELAY,
  ];

  const queryClient = useQueryClient();

  const { user } = useCurrentUser();

  const [
    departureTimeStore,
    startStation,
    endStation,
    genderConstraint,
    gatheringDelay,
    fleetName,
    updateFleet,
  ] = useTripSelectionStore((state) => [
    state.departureTime,
    state.startStation,
    state.endStation,
    state.genderConstraint,
    state.gatheringDelay,
    state.fleetName,
    state.updateFleet,
  ]);

  const { data: suggestions = [], isSuccess: isQuerySuggestionsSucess } =
    useRouteSuggestionsQuery({
      startStationId: startStation?.id,
      endStationId: endStation?.id,
    });

  const { mutate, isPending, isError } = useCreateFleetMutation(() => {
    queryClient.invalidateQueries({ queryKey: [FLEETS_API_PATH] });
  });

  const [departureTime, setDepartureTime] = useState<Date>(departureTimeStore);
  const [suggestionHash, setSuggestionHash] = useState<string | null>(null);

  const displayName = getUserDisplayName(user);

  const handleFleetCreation = () => {
    if (endStation && startStation && suggestionHash) {
      const route = suggestions.find(
        ({ hash }: RouteSuggestion) => hash === suggestionHash,
      );

      if (!route) return;

      mutate({
        name: fleetName || `Fleet de ${displayName}`,
        endStationId: endStation.id,
        startStationId: startStation.id,
        departureTime: departureTime,
        gatheringDelay,
        genderConstraintConfig:
          genderConstraint === GenderConstraint.NO_CONSTRAINT
            ? GenderConstraintCreationConfig.ANY_GENDER
            : GenderConstraintCreationConfig.USER_GENDER_ONLY,
        route,
      });
    }
  };

  if (isQuerySuggestionsSucess && suggestions.length > 0 && !suggestionHash) {
    setSuggestionHash(suggestions[0].hash);
  }

  const handleOnChangeNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFleet({ fleetName: e.target.value });
  };

  function handleChangeGatheringDelay(delay: number): void {
    updateFleet({ gatheringDelay: delay });
  }

  function handleChangeDepartureTime(value: Date): void {
    setDepartureTime(value);
  }

  return (
    <BottomSheetRoot isOpen={isOpen} onWillDismiss={onClose}>
      <h4 className="mt-5 font-bold">Créez votre Fleet</h4>
      <RowContainer>
        <RowContainer.Title>Nom du Fleet -</RowContainer.Title>
        <Input
          label="fleetName"
          value={fleetName}
          placeholder={`Fleet de ${displayName}`}
          onChange={handleOnChangeNameInput}
        />
      </RowContainer>
      <div className="flex h-32 items-center justify-between pr-4">
        <StationsLine className="h-3/4" />
        <div className="ml-3.5 flex h-full flex-[2] flex-col items-end justify-between gap-1">
          <div className="flex w-full rounded-[10px] bg-whiteSmoke px-5 py-3.5 text-grey">
            <p className="line-clamp-2">
              {startStation?.name || 'Pas de station selectionnée.'}
            </p>
          </div>
          <div className="flex w-full rounded-[10px] bg-whiteSmoke px-5 py-3.5 text-grey">
            <p className="line-clamp-2">
              {endStation?.name || 'Pas de station selectionnée.'}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5 py-3.5">
        <div className="flex flex-col gap-1.5">
          <RowContainer className="gap-1.5">
            <FaTrain size={16} />
            <RowContainer.Title className="self-start">
              Lignes disponibles
            </RowContainer.Title>
          </RowContainer>
          <div className="flex items-center gap-2.5 overflow-hidden overflow-x-auto whitespace-nowrap">
            {suggestions.map(({ hash, linesTaken }: RouteSuggestion, index) => (
              <LinesRow
                key={index}
                lines={linesTaken}
                aria-selected={suggestionHash === hash}
                onClick={() => setSuggestionHash(hash)}
              />
            ))}
          </div>
        </div>
        <RowContainer className="gap-1">
          <FaRunning size={18} />
          <RowContainer.Title>Rassemblement -</RowContainer.Title>
          <div className="flex flex-1 items-center gap-2">
            {gatheringDelayOptions.map((value) => (
              <Button
                onClick={() => handleChangeGatheringDelay(value)}
                aria-selected={value === gatheringDelay}
                className="!h-[30px] !rounded-[5px] !text-xs aria-selected:border aria-selected:border-border aria-selected:bg-whiteSmoke aria-selected:text-dark"
                key={value}
              >
                {`- ${value} min`}
              </Button>
            ))}
          </div>
        </RowContainer>
        <RowContainer className="gap-1.5">
          <FaRegCalendar />
          <RowContainer.Title>Départ -</RowContainer.Title>
          <span className="text-grey">
            {formatDateToString(departureTime)} à
          </span>
          <IonDatetimeButton datetime="datetime" />
        </RowContainer>
        {isError && (
          <RowContainer>
            <p className="text-xs leading-normal text-danger">
              Nous sommes désolés, il y a eu une erreur avec la création de
              votre Fleet. Si le problème persiste n'hésitez pas à nous
              contacter.
            </p>
          </RowContainer>
        )}
      </div>

      <RowContainer className="gap-5">
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button onClick={handleFleetCreation} isLoading={isPending}>
          Valider
        </Button>
      </RowContainer>
      <DatetimeModal
        onUpdate={handleChangeDepartureTime}
        value={departureTime}
        min={gatheringDelay + MIN_FORMATION_DELAY}
        presentation="time"
      />
    </BottomSheetRoot>
  );
};

export default CreateFleetModal;
