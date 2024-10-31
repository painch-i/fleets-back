import { useCurrentUser } from '@/features/auth/providers/current-user.provider';
import { useSetNotificationTokenMutation } from '@/features/notifications/set-notification-token.mutation';
import { PluginListenerHandle } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { PushNotifications } from '@capacitor/push-notifications';
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import React, { useCallback, useEffect } from 'react';
import { NotificationData } from './notifications.types';

const firebaseConfig = {
  apiKey: 'AIzaSyBQa4-Z7aaVh5J7K5_wN5tuwXZZP5enfl0',
  authDomain: 'fleets-7f5ae.firebaseapp.com',
  databaseURL:
    'https://fleets-7f5ae-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'fleets-7f5ae',
  storageBucket: 'fleets-7f5ae.appspot.com',
  messagingSenderId: '818399715145',
  appId: '1:818399715145:web:3b598954b58f3a0f3cc498',
  measurementId: 'G-Y884L1EC5T',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);

async function addListeners(): Promise<PluginListenerHandle[]> {
  return Promise.all([
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification) => {
        console.log('Notification push reçue: ', notification);
      },
    ),
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (action) => {
        const notificationData: NotificationData = action.notification.data;
        switch (notificationData.type) {
          // Gère les actions en fonction du type de notification
        }
      },
    ),
  ]);
}

type INotificationsContext = {
  registerNotifications: () => Promise<void>;
};

const NotificationsContext = React.createContext<INotificationsContext>({
  registerNotifications: async () => {},
});

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useCurrentUser();
  const setTokenMutation = useSetNotificationTokenMutation(user.id);
  useEffect(() => {
    // Ajoute les écouteurs pour les notifications push
    const listeners = addListeners();
    return () => {
      listeners.then((listener) => listener.forEach((l) => l.remove()));
    };
  }, []);

  useEffect(() => {
    // Ajoute l'écouteur pour l'enregistrement du token de notification
    const listener = PushNotifications.addListener('registration', (token) => {
      setTokenMutation.mutate({ token: token.value });
    });

    return () => {
      listener.then((l) => l.remove());
    };
  }, []);

  const registerNotifications = useCallback(async () => {
    // Vérifie si l'appareil est capable de recevoir des notifications push
    const info = await Device.getInfo();
    if (info.platform !== 'web') {
      // Demande l'autorisation de recevoir des notifications push
      const permission = await PushNotifications.requestPermissions();
      if (permission.receive === 'granted') {
        // Enregistre l'appareil pour les notifications push
        await PushNotifications.register();
      } else {
        console.error('Permission non accordée pour les notifications push');
      }
    } else {
      const messaging = getMessaging();
      // Demande l'autorisation de recevoir des notifications push
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(messaging, {
          vapidKey:
            'BJO3T7WP4ARpzWWmSZqf3cCq4PAeA9oKhK3xF9l0sC79lM42lLKyeZ2TO2ossmkzdZvJuNqC0YdZtlhyDunR9Xo',
        });
        setTokenMutation.mutate({ token });
      } else {
        console.warn('Permission non accordée pour les notifications push');
      }
    }
  }, []);

  useEffect(() => {
    // Enregistre l'appareil pour les notifications push au montage du composant
    registerNotifications();
  }, []);
  return (
    <NotificationsContext.Provider
      value={{
        registerNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function usePushNotifications() {
  return React.useContext(NotificationsContext);
}
