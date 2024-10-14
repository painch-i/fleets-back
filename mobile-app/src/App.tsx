import { StatusBar, Style } from '@capacitor/status-bar';
import { IonApp, isPlatform, setupIonicReact } from '@ionic/react';
import React, { useEffect } from 'react';

import '@/global.css';
import { EventSocketProvider } from '@/providers/event-socket.provider';
import { GeolocationProvider } from '@/providers/geolocation.provider';
import { QueryClientProvider } from '@/providers/query-client.provider';
import { AppRouter } from '@/routes/app.router';

setupIonicReact({ scrollAssist: false });

const App: React.FC = () => {
  useEffect(() => {
    if (isPlatform('mobile') && !isPlatform('mobileweb')) {
      StatusBar.setStyle({ style: Style.Dark });
      StatusBar.setOverlaysWebView({ overlay: true });
    }
  }, []);

  return (
    <IonApp>
      <QueryClientProvider>
        <EventSocketProvider>
          <GeolocationProvider>
            <AppRouter />
          </GeolocationProvider>
        </EventSocketProvider>
      </QueryClientProvider>
    </IonApp>
  );
};

export default App;
