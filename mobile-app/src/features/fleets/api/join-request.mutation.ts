import {
  MutationOptions,
  useBackendMutation,
} from '@/hooks/use-backend-mutation.hook';

const FLEET_REQUEST_TO_JOIN_API_PATH = 'fleets/{fleetId}/request-to-join';

/**
 * A custom hook to send a join request to a Fleet from {@link FLEET_REQUEST_TO_JOIN_API_PATH} using the `useBackendMutation` hook.
 *
 * @param {string} fleetId - The ID of the Fleet to send a join request.
 * @param {MutationOptions<void, void>['onSuccess']} onSuccess - The function to be called when the mutation is successful.
 *
 * @returns UseMutationResult - It contains the mutation function, status, error and other mutation-related information.
 */
export const useJoinRequestMutation = (
  fleetId: string,
  onSuccess: MutationOptions<void, void>['onSuccess'],
) =>
  useBackendMutation<void, void>(
    {
      path: `${FLEET_REQUEST_TO_JOIN_API_PATH.replace('{fleetId}', fleetId)}`,
    },
    {
      onSuccess,
    },
  );
