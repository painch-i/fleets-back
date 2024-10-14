import {
  MutationOptions,
  useBackendMutation,
} from '@/hooks/use-backend-mutation.hook';
import { RespondToRequestDto } from '@/features/fleets/types/joinRequest.types';

const RESPOND_TO_REQUESTS_API_PATH = 'fleets/{fleetId}/respond-to-request';

/**
 * A custom hook to respond to a Fleet's join request from {@link RESPOND_TO_REQUESTS_API_PATH} using the `useBackendMutation` hook.
 *
 * @param {string} fleetId - The ID of the Fleet linked to the join request.
 * @param {MutationOptions<void, RespondToRequestDto>['onSuccess']} onSuccess - The function to be called when the mutation is successful.
 *
 * @returns UseMutationResult - It contains the mutation function, status, error and other mutation-related information based on the {@link RespondToRequestDto} type.
 */
export const useRespondToRequestMutation = (
  fleetId: string,
  onSuccess: MutationOptions<void, RespondToRequestDto>['onSuccess'],
) =>
  useBackendMutation<void, RespondToRequestDto>(
    {
      path: `${RESPOND_TO_REQUESTS_API_PATH.replace('{fleetId}', fleetId)}`,
    },
    {
      onSuccess,
    },
  );
