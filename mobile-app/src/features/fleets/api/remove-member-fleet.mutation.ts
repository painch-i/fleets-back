import {
  MutationOptions,
  useBackendMutation,
} from '@/hooks/use-backend-mutation.hook';

const FLEET_REMOVE_MEMBER_API_PATH = 'fleets/{fleetId}/remove-member';

type RemoveMemberFleetDTO = {
  userId: string;
};

/**
 * A custom hook to remove member from a Fleet with {@link FLEET_REMOVE_MEMBER_API_PATH} using the `useBackendMutation` hook.
 *
 * @param {string} fleetId - The ID of the Fleet the user is a member of.
 * @param {MutationOptions<void, RemoveMemberFleetDTO>['onSuccess']} onSuccess - The function to be called when the mutation is successful.
 *
 * @returns UseMutationResult - It contains the mutation function, status, error.
 */
export const useRemoveMemberFleetMutation = (
  fleetId: string,
  onSuccess?: MutationOptions<void, RemoveMemberFleetDTO>['onSuccess'],
) =>
  useBackendMutation<void, RemoveMemberFleetDTO>(
    {
      path: `${FLEET_REMOVE_MEMBER_API_PATH.replace('{fleetId}', fleetId)}`,
    },
    {
      onSuccess,
    },
  );
