const getConfigUrl = () => {
  let BACKEND_URL = 'https://api.fleets-app.com';
  let SOCKET_URL = 'wss://api.fleets-app.com';

  // To use this put --mode localServer
  const useLocalServer = process.env.VITE_MODE === 'localServer';

  if (useLocalServer) {
    BACKEND_URL = 'http://localhost:3000';
    SOCKET_URL = 'ws://localhost:3000';
  }

  return { BACKEND_URL, SOCKET_URL };
};

export const { BACKEND_URL, SOCKET_URL } = getConfigUrl();
export const AUTH_TOKEN_LOCAL_KEY = 'token';
