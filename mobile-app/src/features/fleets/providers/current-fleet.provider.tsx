import { useQueryClient } from '@tanstack/react-query';
import React, { createContext, useCallback, useEffect } from 'react';

import { useCurrentUser } from '@/features/auth/providers/current-user.provider';
import { FLEETS_API_PATH } from '@/features/fleets/api/current-fleet.query';
import { FLEET_REQUESTS_LIST_API_PATH } from '@/features/fleets/api/join-requests.query';
import {
  Fleet,
  FleetExtendedStatus,
  FleetStatus,
  IFleetContext as ICurrentFleetContext,
} from '@/features/fleets/types/fleet.types';
import { useEventSocket } from '@/providers/event-socket.provider';
import { getCountDown, getFleetIntermediateStatus } from '@/utils/fleet';

let FleetContext: React.Context<ICurrentFleetContext> | null = null;

interface FleetProviderProps {
  children: React.ReactNode;
  fleet: Fleet;
  isFetching: boolean;
}

// TODO -> Avoir le status de la query

/**
 * Context provider for managing the current Fleet state, providing Fleet data, calculating countdown for the next status and handling fleet-related event socket listeners.
 *
 * @param {FleetProviderProps} {@link FleetProviderProps} - Params for the CurrentFleetProvider, including the children components that will have access to the messages context, the current Fleet data and a boolean to see if the query isFetching.
 *
 * @note All event socket listeners linked to the current Fleet should be managed within this provider.
 */
export function CurrentFleetProvider({
  children,
  fleet,
  isFetching,
}: FleetProviderProps) {
  const queryClient = useQueryClient();
  const { socket } = useEventSocket();
  const { user } = useCurrentUser();

  const isCurrentUserAdmin = user.id === fleet.administratorId;
  const hasCurrentUserConfirmedPresenceAtStartStation: boolean =
    !!fleet.members.find((member) => member.id === user.id)
      ?.hasConfirmedHisPresence;

  const defaultCountDown = getCountDown(fleet);

  const [extendedStatus, setExtendedStatus] =
    React.useState<FleetExtendedStatus>(
      getFleetIntermediateStatus(fleet.status, defaultCountDown),
    );
  const [countDown, setCountDown] = React.useState<string>(defaultCountDown);

  const invalidateCurrentFleetQuery = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [FLEETS_API_PATH] });
  }, [queryClient]);

  if (FleetContext === null) {
    FleetContext = createContext<ICurrentFleetContext>({
      fleet,
      countDown,
      extendedStatus,
      isCurrentUserAdmin,
      hasCurrentUserConfirmedPresenceAtStartStation,
      isFetching,
      invalidateCurrentFleetQuery,
    });
  }

  useEffect(
    function listenCountdown() {
      if ([FleetStatus.ARRIVED, FleetStatus.TRAVELING].includes(fleet.status)) {
        setExtendedStatus(fleet.status);
        return;
      }

      const interval = setInterval(() => {
        const currentCountDown = getCountDown(fleet);

        setExtendedStatus(
          getFleetIntermediateStatus(fleet.status, currentCountDown),
        );

        setCountDown(currentCountDown);
      }, 1000);

      return () => clearInterval(interval);
    },
    [fleet],
  );

  // TODO -> Check si les var "fleet" du useCallkback sont updated
  const onFleetGatheringStart = useCallback(() => {
    queryClient.setQueryData<Fleet>([FLEETS_API_PATH], {
      ...fleet,
      status: FleetStatus.GATHERING,
    });
  }, [queryClient]);

  const onFleetTripStart = useCallback(() => {
    queryClient.setQueryData<Fleet>([FLEETS_API_PATH], {
      ...fleet,
      status: FleetStatus.TRAVELING,
    });
  }, [queryClient]);

  const onFleetTripEnded = useCallback(() => {
    // queryClient.setQueryData<Fleet>([FLEETS_API_PATH], {
    //   ...fleet,
    //   status: FleetStatus.ARRIVED,
    // });

    // Pour le moment disable -> Car dans le back ça delete le Fleet + on resetQuery front
    // Avec ça -> ça set la query donc il pense qu'on a encore un Fleet
    queryClient.resetQueries({ queryKey: [FLEETS_API_PATH] });
  }, [queryClient]);

  const onJoinRequestReceived = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [
        `${FLEET_REQUESTS_LIST_API_PATH.replace('{fleetId}', fleet.id)}`,
      ],
    });
  }, [queryClient]);

  useEffect(
    function subscribeToFleetEvents() {
      socket.on('user-joined-fleet', invalidateCurrentFleetQuery);
      socket.on('member-removed', invalidateCurrentFleetQuery);
      socket.on('join-request-received', onJoinRequestReceived);
      socket.on('fleet-gathering-started', onFleetGatheringStart);
      socket.on('fleet-trip-started', onFleetTripStart);
      socket.on('fleet-ended', onFleetTripEnded);

      return () => {
        socket.off('user-joined-fleet', invalidateCurrentFleetQuery);
        socket.off('member-removed', invalidateCurrentFleetQuery);
        socket.off('join-request-received', onJoinRequestReceived);
        socket.off('fleet-gathering-started', onFleetGatheringStart);
        socket.off('fleet-trip-started', onFleetTripStart);
        socket.off('fleet-ended', onFleetTripEnded);
      };
    },
    [
      socket,
      invalidateCurrentFleetQuery,
      onJoinRequestReceived,
      onFleetGatheringStart,
      onFleetTripStart,
      onFleetTripEnded,
    ],
  );

  return (
    <FleetContext.Provider
      value={{
        countDown,
        fleet,
        extendedStatus,
        isCurrentUserAdmin,
        hasCurrentUserConfirmedPresenceAtStartStation,
        isFetching,
        invalidateCurrentFleetQuery,
      }}
    >
      {children}
    </FleetContext.Provider>
  );
}

export function useCurrentFleet() {
  if (FleetContext === null) {
    throw new Error('FleetContext must be used within a FleetProvider');
  }

  const context = React.useContext(FleetContext);

  if (context === undefined) {
    throw new Error('useFleetFromContext must be used within a FleetProvider');
  }

  return context;
}
