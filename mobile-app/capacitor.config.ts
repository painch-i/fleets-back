import { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'com.fleets.ionic',
  appName: 'Fleets',
  webDir: 'build',
  ios: {
    scheme: 'Fleets',
  },
  plugins: {
    LiveUpdates: {
      appId: 'bb9b8f9a',
      channel: 'Production',
      autoUpdateMethod: 'background',
      maxVersions: 2,
    },
    Keyboard: {
      resize: KeyboardResize.None,
    },
  },
};

export default config;
