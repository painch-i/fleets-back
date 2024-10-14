import { IonPage, IonContent, IonSpinner } from '@ionic/react';

// TODO -> Avoir le logo en svg pour pouvoir faire un vrai loader avec chaque ptit bonhomme qui jump (genre wave loader)

const SplashScreen: React.FC = () => (
  <IonPage>
    <IonContent className="part-[scroll]:flex part-[scroll]:flex-col part-[scroll]:items-center part-[scroll]:justify-center">
      <img src="./assets/logos/logo.png" alt="fleet" className="h-[100px]" />
      <IonSpinner
        name="dots"
        className="size-[100px] text-primary"
        color="currentColor"
      />
    </IonContent>
  </IonPage>
);

export default SplashScreen;
