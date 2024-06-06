import { Fragment, useState } from 'react';
import { useIonRouter } from '@ionic/react';
import { useQueryClient } from '@tanstack/react-query';
import { Geolocation, Position } from '@capacitor/geolocation';
import { PermissionState } from '@capacitor/core';
import {
  AndroidSettings,
  IOSSettings,
  NativeSettings,
} from 'capacitor-native-settings';

import AlertModal from '@/components/AlertModal/Alert.modal';
import Button from '@/components/Button/Button.global';
import useVisibilityState from '@/hooks/use-visibility-state.hook';
import { useConfirmPresenceAtStationMutation } from '@/features/fleets/api/confirm-presence-at-station.mutation';
import { useEndFleetMutation } from '@/features/fleets/api/end-fleet.mutation';
import { FLEETS_API_PATH } from '@/features/fleets/api/current-fleet.query';
import { useCurrentFleet } from '@/features/fleets/providers/current-fleet.provider';
import { GEOLOCATION_TEXTS } from '@/features/fleets/constants/fleets.text';
import { FleetStatus } from '@/features/fleets/types/fleet.types';
import { checkRadius } from '@/utils/fleet';

type ButtonStationType = 'start' | 'end';

const GeolocationHandler = () => {
  const router = useIonRouter();
  const queryClient = useQueryClient();
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
    useState<boolean>(false);
  const [currentButtonIsLoading, setCurrentButtonIsLoading] =
    useState<boolean>(false);

  function handleGoToChatPage(): void {
    router.push('/fleet/chat');
  }

  async function openAppSettings(): Promise<void> {
    await NativeSettings.open({
      optionAndroid: AndroidSettings.ApplicationDetails,
      optionIOS: IOSSettings.App,
    });

    close();
    setIsGeolocationPermissionDenied(false);
  }

  async function checkUserGeolocationPermission(): Promise<PermissionState> {
    try {
      const geolocationPermissionStatus = await Geolocation.checkPermissions();

      return geolocationPermissionStatus.coarseLocation;
    } catch (error: unknown) {
      console.error(
        `checkUserGeolocationPermission - System location services are disabled:: ${error}`,
      );
      return 'prompt';
    }
  }

  async function requestUserGeolocationPermission(): Promise<void> {
    close();

    try {
      const geolocationPermissionStatus =
        await Geolocation.requestPermissions();

      await fetchUserGeolocation(
        geolocationPermissionStatus.coarseLocation,
        status === FleetStatus.GATHERING ? 'start' : 'end',
      );
    } catch (error: unknown) {
      console.error(
        `requestUserGeolocationPermission - System location services are disabled:: ${error}`,
      );
    }
  }

  async function handleUserGeolocationPermission(
    type: ButtonStationType,
  ): Promise<void> {
    setCurrentButtonIsLoading(true);

    const geolocationPermissionStatus = await checkUserGeolocationPermission();

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
      const position = await Geolocation.getCurrentPosition();

      if (type === 'start') {
        await handleUserArrival(position.coords);
      } else {
        await handleOnEndFleet(position.coords);
      }

      setCurrentButtonIsLoading(false);
      return;
    }

    setCurrentButtonIsLoading(false);
    setIsGeolocationPermissionDenied(true);
    open();
  }

  async function handleUserArrival(
    userPosition: Position['coords'],
  ): Promise<void> {
    const isAtStartStation = checkRadius(
      userPosition.latitude,
      userPosition.longitude,
      fleet.startStation.latitude,
      fleet.startStation.longitude,
    );

    if (isAtStartStation) {
      mutateConfirmUserPresenceAtStation();
      return;
    }

    alert("Vous ne semblez pas être à l'arrêt de départ");
  }

  async function handleOnEndFleet(
    userPosition: Position['coords'],
  ): Promise<void> {
    const isAtEndStation = checkRadius(
      userPosition.latitude,
      userPosition.longitude,
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
            : requestUserGeolocationPermission
        }
        title={GEOLOCATION_TEXTS.TITLE}
        buttonCancelLabel={currentAlertModalButtonCancelLabel}
        description={currentAlertModalDescription}
      />
    </Fragment>
  );
};

export default GeolocationHandler;
