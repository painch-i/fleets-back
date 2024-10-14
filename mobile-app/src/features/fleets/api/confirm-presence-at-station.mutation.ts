import { useQueryClient } from '@tanstack/react-query';

import { useBackendMutation } from '@/hooks/use-backend-mutation.hook';
import { FLEETS_API_PATH } from '@/features/fleets/api/current-fleet.query';

const FLEET_COMFIRM_PRESENCE_AT_STATION_API_PATH =
  'fleets/{fleetId}/confirm-presence-at-station';

/**
 * A custom hook to confirmt the presence of a user at the start station of a Fleet from {@link FLEET_COMFIRM_PRESENCE_AT_STATION_API_PATH} using the `useBackendMutation` hook.
 *
 * @param {string} fleetId - The ID of the Fleet to be ended.
 *
 * @returns UseMutationResult - It contains the mutation function, status, error and other mutation-related information.
 *
 * @description If the mutation is successful, the {@link FLEETS_API_PATH} query will be invalidate.
 */
export const useConfirmPresenceAtStationMutation = (fleetId: string) => {
  const queryClient = useQueryClient();

  return useBackendMutation<void>(
    {
      path: `${FLEET_COMFIRM_PRESENCE_AT_STATION_API_PATH.replace('{fleetId}', fleetId)}`,
    },
    {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: [FLEETS_API_PATH] });
      },
    },
  );
};
