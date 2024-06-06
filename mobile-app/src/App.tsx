import React, { useEffect } from 'react';
import { IonApp, isPlatform, setupIonicReact } from '@ionic/react';
import { StatusBar, Style } from '@capacitor/status-bar';

import '@/global.css';
import { EventSocketProvider } from '@/providers/event-socket.provider';
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
          <AppRouter />
        </EventSocketProvider>
      </QueryClientProvider>
    </IonApp>
  );
};

export default App;
