import {
  MutationOptions,
  useBackendMutation,
} from '@/hooks/use-backend-mutation.hook';

const FLEET_END_API_PATH = 'fleets/{fleetId}/end';

/**
 * A custom hook to end a Fleet from {@link FLEET_END_API_PATH} using the `useBackendMutation` hook.
 *
 * @param {string} fleetId - The ID of the Fleet to be ended.
 * @param {MutationOptions<void>['onSuccess']} onSuccess - The function to be called when the mutation is successful.
 *
 * @returns UseMutationResult - It contains the mutation function, status, error and other mutation-related information.
 */
export const useEndFleetMutation = (
  fleetId: string,
  onSuccess: MutationOptions<void>['onSuccess'],
) =>
  useBackendMutation<void>(
    {
      path: `${FLEET_END_API_PATH.replace('{fleetId}', fleetId)}`,
    },
    {
      onSuccess,
    },
  );
