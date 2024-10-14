import { Fleet, CreateFleetDto } from '@/features/fleets/types/fleet.types';
import {
  MutationOptions,
  useBackendMutation,
} from '@/hooks/use-backend-mutation.hook';

export const FLEET_CREATE_API_PATH = 'fleets/create-fleet';

/**
 * A custom hook for creating a Fleet from {@link FLEET_CREATE_API_PATH} using the `useBackendMutation` hook.
 *
 * @param {MutationOptions<Fleet, CreateFleetDto>['onSuccess']} onSuccess - The function to be called when the mutation is successful.
 *
 * @returns UseMutationResult - It contains the mutation function, status, error and other mutation-related information based on the {@link CreateFleetDto} type.
 */
export const useCreateFleetMutation = (
  onSuccess: MutationOptions<Fleet, CreateFleetDto>['onSuccess'],
) =>
  useBackendMutation<Fleet, CreateFleetDto>(
    {
      path: FLEET_CREATE_API_PATH,
    },
    { onSuccess },
  );
