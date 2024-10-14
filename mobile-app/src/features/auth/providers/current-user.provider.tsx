import { useQueryClient } from '@tanstack/react-query';
import React, { createContext, useCallback, useEffect } from 'react';

import { IUserContext, User } from '@/features/auth/types/user.types';
import { FLEETS_API_PATH } from '@/features/fleets/api/current-fleet.query';
import { useEventSocket } from '@/providers/event-socket.provider';

let UserContext: React.Context<IUserContext> | null = null;

interface UserProviderProps {
  children: React.ReactNode;
  user: User;
}

/**
 * Context provider for providing user data and handling user-related event socket listeners.
 *
 * @param {UserProviderProps} {@link UserProviderProps} - Params for the CurrentUserProvider, including the children components that will have access to the user context and the user data.
 *
 * @note All event socket listeners linked to the user should be managed within this provider.
 */
export function CurrentUserProvider({ children, user }: UserProviderProps) {
  const queryClient = useQueryClient();
  const { socket } = useEventSocket();

  if (UserContext === null) {
    UserContext = createContext<IUserContext>({
      user,
    });
  }

  const onJoinRequestAccepted = useCallback(() => {
    queryClient.resetQueries({ queryKey: [FLEETS_API_PATH] });
  }, [queryClient]);

  useEffect(
    function subscribeToUserEvents() {
      socket.on('join-request-accepted', onJoinRequestAccepted);

      return () => {
        socket.off('join-request-accepted', onJoinRequestAccepted);
      };
    },
    [socket],
  );

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}

export function useCurrentUser() {
  if (UserContext === null) {
    throw new Error('useCurrentUser must be used within a UserProvider');
  }

  const context = React.useContext(UserContext);

  if (context === undefined) {
    throw new Error('useCurrentUser must be used within a UserProvider');
  }

  return context;
}
