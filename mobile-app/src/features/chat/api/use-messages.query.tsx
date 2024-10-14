import { UseQueryResult } from '@tanstack/react-query';

import { DryMessage } from '@/features/chat/chat.types';
import { useBackendQuery } from '@/hooks/use-backend-query.hook';

export const FLEET_GET_MESSAGES_API_PATH = 'fleets/{fleetId}/get-messages';

/**
 * A custom hook for fetching all the messages of a Fleet from {@link FLEET_GET_MESSAGES_API_PATH} using the `useBackendQuery` hook.
 *
 * @param {string} fleetId - The ID of the Fleet whose messages are to be retrieved.
 *
 * @returns {UseQueryResult<DryMessage[]>} UseQueryResult - It contains the data, error, status and other query-related information based on the {@link DryMessage} type.
 */
export const useMessagesQuery = (
  fleetId: string,
): UseQueryResult<DryMessage[]> =>
  useBackendQuery<DryMessage[]>({
    path: `${FLEET_GET_MESSAGES_API_PATH.replace('{fleetId}', fleetId)}`,
  });
