import React from 'react';

import { io, Socket } from 'socket.io-client';

import { SOCKET_URL } from '@/config';
import { authStore } from '@/features/auth/stores/auth.store';

const socket = io(`${SOCKET_URL}/events`, {
  transports: ['websocket'],
});

socket.auth = (cb) => {
  const { token } = authStore.getState();
  cb({ token });
};

socket.on('invalid-token', () => {
  authStore.getState().removeToken();
});

const authenticate = (token: string) => {
  socket.emit('authenticate', token);
};

const logout = () => {
  socket.emit('logout');
};

type IEventSocketContext = {
  socket: Socket;
  authenticate: (token: string) => void;
  logout: () => void;
};

const EventSocketContext = React.createContext<IEventSocketContext>({
  socket,
  authenticate,
  logout,
});

/**
 * Context provider for managing WebSocket connections and emitting events.
 *
 * @param {React.ReactNode} children - The children components that will have access to the WebSocket context.
 *
 * @description This provider manages WebSocket connections, provides access to the WebSocket instance and functions to emit events.
 */
export function EventSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EventSocketContext.Provider value={{ socket, authenticate, logout }}>
      {children}
    </EventSocketContext.Provider>
  );
}

export function useEventSocket() {
  return React.useContext(EventSocketContext);
}
