import { isEnvFlagTrue } from '@/utils/env';
import { Capacitor } from '@capacitor/core';

const LAN_SERVER_IP = '192.168.1.21';
const LOCAL_SERVER_IP = 'localhost';
const LOCAL_SERVER_PORT = 3011;

function getConfigUrl() {
  const isNativePlatform = Capacitor.isNativePlatform();
  const localServerIp = isNativePlatform ? LAN_SERVER_IP : LOCAL_SERVER_IP;
  let BACKEND_URL = 'https://api.fleets-app.com';
  let SOCKET_URL = 'wss://api.fleets-app.com';

  if (isEnvFlagTrue('VITE_LOCAL_SERVER')) {
    BACKEND_URL = `http://${localServerIp}:${LOCAL_SERVER_PORT}`;
    SOCKET_URL = `ws://${localServerIp}:${LOCAL_SERVER_PORT}`;
  }

  return { BACKEND_URL, SOCKET_URL };
}

export const { BACKEND_URL, SOCKET_URL } = getConfigUrl();
