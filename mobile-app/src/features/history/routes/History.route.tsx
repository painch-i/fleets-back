/** @jsxImportSource @emotion/react */

import { IonContent, IonPage, useIonRouter } from '@ionic/react';
import { css } from '@emotion/react';

const styles = css({});

export const History: React.FC = () => {
  const router = useIonRouter();

  const hasFleet: boolean = true;

  const navigateToDestination = () => {
    router.push('/fleet');
  };

  return (
    <IonPage>
      <IonContent css={styles}>
        {hasFleet && (
          <button onClick={navigateToDestination}>GO TO CURRENT FLEET</button>
        )}
      </IonContent>
    </IonPage>
  );
};
