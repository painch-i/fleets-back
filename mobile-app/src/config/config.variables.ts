import { isEnvFlagTrue } from '@/utils/env';

export const { BACKEND_URL, SOCKET_URL } = getConfigUrl();

function getConfigUrl() {
  const localServerIp = '192.168.1.21';
  let BACKEND_URL = 'https://api.fleets-app.com';
  let SOCKET_URL = 'wss://api.fleets-app.com';

  if (isEnvFlagTrue('VITE_LOCAL_SERVER')) {
    BACKEND_URL = `http://${localServerIp}:3011`;
    SOCKET_URL = `ws://${localServerIp}:3011`;
  }

  return { BACKEND_URL, SOCKET_URL };
}
