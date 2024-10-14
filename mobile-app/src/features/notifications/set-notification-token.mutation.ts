import { SetNotificationTokenOptions } from '@/features/notifications/notifications.types';
import { useBackendMutation } from '@/hooks/use-backend-mutation.hook';

/**
 * A custom hook for setting the notification token using the `useBackendMutation` hook.
 *
 * @returns UseMutationResult - It contains the mutation function, status, error and other mutation-related information based on the {@link CreateFleetDto} type.
 */
export const useSetNotificationTokenMutation = (userId: string) =>
  useBackendMutation<void, SetNotificationTokenOptions>({
    path: `users/${userId}/set-notification-token`,
  });
