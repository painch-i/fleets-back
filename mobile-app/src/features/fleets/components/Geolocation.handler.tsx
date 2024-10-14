import { useQueryClient } from '@tanstack/react-query';
import {
  AndroidSettings,
  IOSSettings,
  NativeSettings,
} from 'capacitor-native-settings';
import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router';

import AlertModal from '@/components/AlertModal/Alert.modal';
import Button from '@/components/Button/Button.global';
import { useConfirmPresenceAtStationMutation } from '@/features/fleets/api/confirm-presence-at-station.mutation';
import { FLEETS_API_PATH } from '@/features/fleets/api/current-fleet.query';
import { useEndFleetMutation } from '@/features/fleets/api/end-fleet.mutation';
import { GEOLOCATION_TEXTS } from '@/features/fleets/constants/fleets.text';
import { useCurrentFleet } from '@/features/fleets/providers/current-fleet.provider';
import { FleetStatus } from '@/features/fleets/types/fleet.types';
import useFlag from '@/hooks/use-flag.hook';
import useVisibilityState from '@/hooks/use-visibility-state.hook';
import { checkRadius } from '@/utils/fleet';

import { Position, useGeolocation } from '@/providers/geolocation.provider';

type ButtonStationType = 'start' | 'end';

const GeolocationHandler = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isBypassPresenceConfirmationFlagOn = useFlag(
    'BYPASS_PRESENCE_CONFIRMATION',
  );
  const { open, close, isOpen } = useVisibilityState();

  const {
    fleet,
    hasCurrentUserConfirmedPresenceAtStartStation,
    isCurrentUserAdmin,
  } = useCurrentFleet();
  const { status, id } = fleet;

  const {
    mutate: mutateConfirmUserPresenceAtStation,
    isPending: isPendingConfirmUserPresence,
  } = useConfirmPresenceAtStationMutation(id);
  const { mutate: mutateEndFleet, isPending: isPendingEndFleet } =
    useEndFleetMutation(id, () => {
      queryClient.resetQueries({ queryKey: [FLEETS_API_PATH] });
    });

  const [isGeolocationPermissionDenied, setIsGeolocationPermissionDenied] =
    useState(false);
  const [currentButtonIsLoading, setCurrentButtonIsLoading] = useState(false);

  // Using the geolocation hooks from GeolocationProvider
  const {
    checkGeolocationPermission,
    requestGeolocationPermission,
    getCurrentPosition,
  } = useGeolocation();

  function handleGoToChatPage(): void {
    navigate('/fleet/chat');
  }

  async function openAppSettings(): Promise<void> {
    await NativeSettings.open({
      optionAndroid: AndroidSettings.ApplicationDetails,
      optionIOS: IOSSettings.App,
    });

    close();
    setIsGeolocationPermissionDenied(false);
  }

  async function handleUserGeolocationPermission(
    type: ButtonStationType,
  ): Promise<void> {
    if (isBypassPresenceConfirmationFlagOn) {
      if (type === 'start') {
        mutateConfirmUserPresenceAtStation();
        return;
      }

      mutateEndFleet();
      return;
    }

    setCurrentButtonIsLoading(true);

    const geolocationPermissionStatus = await checkGeolocationPermission();

    if (
      geolocationPermissionStatus === 'granted' ||
      geolocationPermissionStatus === 'denied'
    ) {
      await fetchUserGeolocation(geolocationPermissionStatus, type);
      setCurrentButtonIsLoading(false);
      return;
    }

    open();
  }

  async function fetchUserGeolocation(
    geolocationPermissionStatus: PermissionState,
    type: ButtonStationType,
  ): Promise<void> {
    if (geolocationPermissionStatus === 'granted') {
      const position = await getCurrentPosition();
      if (!position) {
        alert('Impossible de récupérer votre position');
        setCurrentButtonIsLoading(false);
        return;
      }
      if (type === 'start') {
        await handleUserArrival(position);
      } else {
        await handleOnEndFleet(position);
      }

      setCurrentButtonIsLoading(false);
      return;
    }

    setCurrentButtonIsLoading(false);
    setIsGeolocationPermissionDenied(true);
    open();
  }

  async function handleUserArrival(userPosition: Position): Promise<void> {
    const isAtStartStation = checkRadius(
      userPosition.coords.latitude,
      userPosition.coords.longitude,
      fleet.startStation.latitude,
      fleet.startStation.longitude,
    );

    if (isAtStartStation) {
      mutateConfirmUserPresenceAtStation();
      return;
    }

    alert("Vous ne semblez pas être à l'arrêt de départ");
  }

  async function handleOnEndFleet(userPosition: Position): Promise<void> {
    const isAtEndStation = checkRadius(
      userPosition.coords.latitude,
      userPosition.coords.longitude,
      fleet.endStation.latitude,
      fleet.endStation.longitude,
    );

    if (isAtEndStation) {
      mutateEndFleet();
      return;
    }

    alert("Vous ne semblez pas être à l'arrêt d'arrivée");
  }

  const CurrentButtonDisplayed = () => {
    if (status === FleetStatus.GATHERING) {
      if (hasCurrentUserConfirmedPresenceAtStartStation) {
        return (
          <Button onClick={handleGoToChatPage}>
            Parle avec les autres membres !
          </Button>
        );
      }

      return (
        <Button
          onClick={() => handleUserGeolocationPermission('start')}
          isLoading={currentButtonIsLoading || isPendingConfirmUserPresence}
        >
          Je suis à l'arrêt de départ
        </Button>
      );
    }

    if (status === FleetStatus.TRAVELING && isCurrentUserAdmin) {
      return (
        <Button
          onClick={() => handleUserGeolocationPermission('end')}
          isLoading={currentButtonIsLoading || isPendingEndFleet}
        >
          Je suis à l'arrêt d'arrivée
        </Button>
      );
    }

    return <Fragment />;
  };

  const currentAlertModalDescription =
    status === FleetStatus.GATHERING
      ? isGeolocationPermissionDenied
        ? GEOLOCATION_TEXTS.DESCRIPTION_DENIED
        : GEOLOCATION_TEXTS.DESCRIPTION
      : isGeolocationPermissionDenied
        ? GEOLOCATION_TEXTS.DESCRIPTION_END_DENIED
        : GEOLOCATION_TEXTS.DESCRIPTION_END;

  const currentAlertModalButtonCancelLabel = isGeolocationPermissionDenied
    ? GEOLOCATION_TEXTS.CONFIRM_DENIED
    : GEOLOCATION_TEXTS.CONFIRM;

  return (
    <Fragment>
      <CurrentButtonDisplayed />
      <AlertModal
        isOpen={isOpen}
        onClose={close}
        onCancel={
          isGeolocationPermissionDenied
            ? openAppSettings
            : requestGeolocationPermission
        }
        title={GEOLOCATION_TEXTS.TITLE}
        buttonCancelLabel={currentAlertModalButtonCancelLabel}
        description={currentAlertModalDescription}
      />
    </Fragment>
  );
};

export default GeolocationHandler;
