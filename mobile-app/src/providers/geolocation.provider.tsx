import { Device } from '@capacitor/device';
import { Geolocation } from '@capacitor/geolocation';
import React, { useCallback, useEffect, useState } from 'react';

export type Position = {
  coords: {
    latitude: number;
    longitude: number;
  };
};

type IGeolocationContext = {
  checkGeolocationPermission: () => Promise<PermissionState>;
  requestGeolocationPermission: () => Promise<void>;
  getCurrentPosition: () => Promise<Position | null>;
};

const GeolocationContext = React.createContext<IGeolocationContext>({
  checkGeolocationPermission: async () => 'denied',
  requestGeolocationPermission: async () => {},
  getCurrentPosition: async () => null,
});

export function GeolocationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isWeb, setIsWeb] = useState<boolean>(false);

  useEffect(() => {
    const checkPlatform = async () => {
      const info = await Device.getInfo();
      setIsWeb(info.platform === 'web');
    };
    checkPlatform();
  }, []);

  const checkGeolocationPermission = useCallback(async () => {
    if (isWeb) {
      // Logique spécifique au web
      const permissionStatus = await navigator.permissions.query({
        name: 'geolocation',
      });
      if (permissionStatus.state !== 'granted') {
        console.warn('Permission non accordée pour la géolocalisation (web)');
      }
      return permissionStatus.state;
    } else {
      // Logique pour mobile (Capacitor)
      try {
        const permissionStatus = await Geolocation.checkPermissions();
        if (permissionStatus.coarseLocation !== 'granted') {
          console.warn(
            'Permission non accordée pour la géolocalisation (mobile)',
          );
          return 'denied';
        }
        return 'granted';
      } catch (error) {
        console.error(
          'Erreur lors de la vérification des permissions de géolocalisation (mobile)',
          error,
        );
        return 'denied';
      }
    }
  }, [isWeb]);

  const requestGeolocationPermission = useCallback(async () => {
    if (isWeb) {
      // Logique spécifique au web
      navigator.geolocation.getCurrentPosition(
        () => {},
        () => {
          console.error('Permission refusée pour la géolocalisation (web)');
        },
      );
    } else {
      // Logique pour mobile (Capacitor)
      try {
        const permissionStatus = await Geolocation.requestPermissions();
        if (permissionStatus.coarseLocation !== 'granted') {
        } else {
        }
      } catch (error) {
        console.error(
          'Erreur lors de la demande de permissions de géolocalisation (mobile)',
          error,
        );
      }
    }
  }, [isWeb]);

  const getCurrentPosition = useCallback(async () => {
    if (isWeb) {
      // Logique spécifique au web
      return new Promise<GeolocationPosition | null>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position),
          (error) => {
            console.error(
              'Erreur lors de la récupération de la position actuelle (web)',
              error,
            );
            reject(null);
          },
        );
      });
    } else {
      // Logique pour mobile (Capacitor)
      try {
        const position = await Geolocation.getCurrentPosition();
        return position;
      } catch (error) {
        console.error(
          'Erreur lors de la récupération de la position actuelle (mobile)',
          error,
        );
        return null;
      }
    }
  }, [isWeb]);

  useEffect(() => {
    // Vérifier les permissions de géolocalisation au montage
    checkGeolocationPermission();
  }, [checkGeolocationPermission]);

  return (
    <GeolocationContext.Provider
      value={{
        checkGeolocationPermission,
        requestGeolocationPermission,
        getCurrentPosition,
      }}
    >
      {children}
    </GeolocationContext.Provider>
  );
}

export function useGeolocation() {
  return React.useContext(GeolocationContext);
}
