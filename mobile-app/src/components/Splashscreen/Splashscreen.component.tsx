/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { IonPage, IonContent, IonSpinner } from '@ionic/react';

import { colors } from '@/styles';

const styles = css({
  '::part(scroll)': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  '& > img': {
    height: 100,
  },
  '& > ion-spinner': {
    '--color': colors.primary,
    height: 100,
    width: 100,
  },
});

// TODO -> Avoir le logo en svg pour pouvoir faire un vrai loader avec chaque ptit bonhomme qui jump (genre wave loader)

const SplashScreen: React.FC = () => (
  <IonPage>
    <IonContent css={styles}>
      <img src="./assets/logos/logo.png" alt="fleet" />
      <IonSpinner name="dots" />
    </IonContent>
  </IonPage>
);

export default SplashScreen;
