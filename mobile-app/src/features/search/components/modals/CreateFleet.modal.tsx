/** @jsxImportSource @emotion/react */

import { useState } from 'react';
import { css } from '@emotion/react';
import { FaRunning } from 'react-icons/fa';
import { useQueryClient } from '@tanstack/react-query';
import { IonDatetimeButton } from '@ionic/react';

import BottomSheet from '@/components/BottomSheet/Bottom.sheet';
import Button from '@/components/Button/Button.global';
import Input from '@/components/Input/Input.global';
import { StationsLine } from '@/components/StationsLine/Stations.line';
import { useCurrentUserQuery } from '@/features/auth/api/use-current-user.query';
import { useCreateFleetMutation } from '@/features/fleets/api/create-fleet.mutation';
import {
  GenderConstraint,
  GenderConstraintCreationConfig,
} from '@/features/fleets/types/fleet.types';
import { useTripSelectionStore } from '@/features/search/stores/trip-selection.store';
import { colors } from '@/styles';
import { GlobalModalOptions } from '@/types';
import { formatDateToString } from '@/utils/date';
import { getUserDisplayName } from '@/utils/user';
import { FLEETS_API_PATH } from '@/features/fleets/api/current-fleet.query';
import DatetimeModal from '@/components/DatetimeModal/Datetime.modal';

const styles = css({
  h4: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  '.infosContainer': {
    height: '125px',
    display: 'flex',
    flexDirection: 'row',
    padding: '0 0 0 16px',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  '.infos': {
    flex: 2,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: '15px',
    '& > div': {
      width: '100%',
      padding: '14px 20px',
      display: 'flex',
      backgroundColor: colors.whiteSmoke,
      borderRadius: '10px',
      '& > p': {
        color: colors.grey,
      },
    },
  },
  '.rowContainer': {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: '5px 2px 5px 0',
    '& > p': {
      color: 'black',
      fontWeight: 'bold',
      fontSize: 16,
      whiteSpace: 'nowrap',
    },
    '& > p.error': {
      color: colors.danger,
      whiteSpace: 'unset',
      fontSize: 13,
      fontWeight: 'normal',
      lineHeight: 1.5,
    },
    '& > span': {
      color: colors.grey,
    },
  },
  '.dateContainer': {
    display: 'flex',
    flexDirection: 'column',
    padding: '15px 0',
    gap: 20,
    '& > .rowContainer': {
      gap: 5,
      '& > .dateButtonsRow': {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      },
    },
  },
  '.buttonsContainer': {
    gap: 20,
  },
});

const customStyleStationLine = css({
  height: '75%',
});

const customStyleButtonGathering = (isSelected: boolean) =>
  css({
    height: 30,
    borderRadius: 5,
    fontSize: 11,
    ...(!isSelected && {
      backgroundColor: colors.whiteSmoke,
      border: `1px solid ${colors.border}`,
      color: 'black',
    }),
  });

const gatheringDelayOptions = [5, 10, 15];

export const CreateFleetModal = ({ isOpen, onClose }: GlobalModalOptions) => {
  const queryClient = useQueryClient();

  const { data: user } = useCurrentUserQuery();

  const [
    selectedTransportMode,
    departureTimeStore,
    startStation,
    endStation,
    selectedLine,
    genderConstraint,
    gatheringDelay,
    fleetName,
    updateFleet,
  ] = useTripSelectionStore((state) => [
    state.selectedTransportMode,
    state.departureTime,
    state.startStation,
    state.endStation,
    state.selectedLine,
    state.genderConstraint,
    state.gatheringDelay,
    state.fleetName,
    state.updateFleet,
  ]);

  const { mutate, isPending, isError } = useCreateFleetMutation(() => {
    queryClient.invalidateQueries({ queryKey: [FLEETS_API_PATH] });
  });

  const [departureTime, setDepartureTime] = useState<Date>(departureTimeStore);

  const displayName = getUserDisplayName(user?.email || '');

  const handleFleetCreation = () => {
    if (selectedLine && endStation && startStation) {
      mutate({
        name: fleetName || `Fleet de ${displayName}`,
        lineId: selectedLine.id,
        endStationId: endStation.id,
        startStationId: startStation.id,
        departureTime: departureTime,
        gatheringDelay,
        genderConstraintConfig:
          genderConstraint === GenderConstraint.NO_CONSTRAINT
            ? GenderConstraintCreationConfig.ANY_GENDER
            : GenderConstraintCreationConfig.USER_GENDER_ONLY,
      });
    }
  };

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
    <BottomSheet isOpen={isOpen} onWillDismiss={onClose} css={styles}>
      <h4>Créez votre Fleet</h4>
      <div className="rowContainer">
        <p>Nom du Fleet -</p>
        <Input
          label="fleetName"
          value={fleetName}
          placeholder={`Fleet de ${displayName}`}
          onChange={handleOnChangeNameInput}
        />
      </div>
      <div className="infosContainer">
        <StationsLine customStyle={customStyleStationLine} />
        <div className="infos">
          <div>
            <p>{startStation?.name || 'Pas de station selectionnée.'}</p>
          </div>
          <div>
            <p>{endStation?.name || 'Pas de station selectionnée.'}</p>
          </div>
        </div>
      </div>
      <div className="dateContainer">
        <div className="rowContainer">
          <FaRunning size={18} />
          <p>Rassemblement -</p>
          <div className="dateButtonsRow">
            {gatheringDelayOptions.map((value) => (
              <Button
                customStyle={customStyleButtonGathering(
                  value === gatheringDelay,
                )}
                onClick={() => handleChangeGatheringDelay(value)}
                key={value}
              >
                {`- ${value} min`}
              </Button>
            ))}
          </div>
        </div>
        <div className="rowContainer">
          <selectedTransportMode.icon size={15} />
          <p>Départ -</p>
          <span>{formatDateToString(departureTime)} à</span>
          <IonDatetimeButton datetime="datetime" />
        </div>
        {isError && (
          <div className="rowContainer">
            <p className="error">
              Nous sommes désolés, il y a eu une erreur avec la création de
              votre Fleet. Si le problème persiste n'hésitez pas à nous
              contacter.
            </p>
          </div>
        )}
      </div>
      <div className="rowContainer buttonsContainer">
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button onClick={handleFleetCreation} isLoading={isPending}>
          Valider
        </Button>
      </div>
      <DatetimeModal
        onUpdate={handleChangeDepartureTime}
        value={departureTime}
        min={gatheringDelay + 5}
        presentation="time"
      />
    </BottomSheet>
  );
};
