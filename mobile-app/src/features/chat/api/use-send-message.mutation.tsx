import { DryMessage, SendMessageBody } from '@/features/chat/chat.types';
import { useBackendMutation } from '@/hooks/use-backend-mutation.hook';

const FLEET_SEND_MESSAGE_API_PATH = 'fleets/{fleetId}/send-message';

/**
 * A custom hook for sending a message in a Fleet from {@link FLEET_SEND_MESSAGE_API_PATH} using the `useBackendMutation` hook.
 *
 * @param {string} fleetId - The ID of the Fleet to which the message will be sent.
 *
 * @returns UseMutationResult - It contains the mutation function, status, error and other mutation-related information based on the {@link SendMessageBody} type.
 */
export const useSendMessageMutation = (fleetId: string) =>
  useBackendMutation<DryMessage, SendMessageBody>({
    path: `${FLEET_SEND_MESSAGE_API_PATH.replace('{fleetId}', fleetId)}`,
  });
