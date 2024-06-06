/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { useState } from 'react';
import { IonContent, IonPage, useIonRouter } from '@ionic/react';

import { colors } from '@/styles';

import Button from '@/components/Button/Button.global';
import ProgressPoint from '@/components/ProgressPoint/Progress.point';

const styles = css({
  '::part(background)': {
    color: colors.dark,
    backgroundColor: colors.blue,
  },
  '::part(scroll)': {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  '.container': {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '0px 20px 20px',
    alignItems: 'center',
    zIndex: 10,
    img: {
      width: 50,
      height: 33,
    },
  },
  '.content': {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    position: 'relative',
    overflow: 'hidden',
    '.container-slides': {
      width: 'inherit',
      display: 'flex',
      transition: 'transform 0.4s ease',
      '.slide': {
        flex: '0 0 100%',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        gap: 35,
        color: colors.whiteSmoke,
        h1: {
          fontSize: 47,
          textTransform: 'uppercase',
        },
        p: {
          fontSize: 15,
          lineHeight: 1.5,
        },
      },
    },
    '.progress-point-container': {
      width: 70,
      height: 10,
      '.point': {
        backgroundColor: colors.primary_opaque,
      },
      '.active': {
        backgroundColor: colors.whiteSmoke,
      },
    },
  },
  '.container-buttons': {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    alignItems: 'center',
    fontWeight: 'bold',
    fontFamily: 'Anybody',
  },
});

const customStyleButtonRegister = css({
  backgroundColor: colors.whiteSmoke,
  color: colors.blue,
});

const customStyleButtonLogin = css({
  backgroundColor: 'transparent',
  color: colors.whiteSmoke,
});

const OnBoarding: React.FC = () => {
  const router = useIonRouter();

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [startX, setStartX] = useState<number | null>(null);

  function handleTouchStart(e: React.TouchEvent<HTMLDivElement>): void {
    setStartX(e.touches[0].clientX);
  }

  function handleTouchMove(e: React.TouchEvent<HTMLDivElement>): void {
    if (!startX) return;

    const diff = startX - e.touches[0].clientX;

    if (diff > 50 && currentStep < 2) {
      setCurrentStep((prevState) => prevState + 1);
      setStartX(null);
      return;
    }

    if (diff < -50 && currentStep > 0) {
      setCurrentStep((prevState) => prevState - 1);
      setStartX(null);
    }
  }

  function handleTouchEnd(): void {
    setStartX(null);
  }

  function redirectToLogin(): void {
    router.push('/login');
  }

  function redirectToRegister(): void {
    router.push('/register');
  }

  return (
    <IonPage>
      <IonContent css={styles}>
        <div
          className="container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img src="./assets/logos/logo-white.png" alt="fleet-logo" />
          <div className="content">
            <div
              className="container-slides"
              style={{ transform: `translateX(-${currentStep * 100}%)` }}
            >
              <div className="slide">
                <h1>Optez pour la sécurité</h1>
                <p>
                  Un trajet de prévu à une heure tardive ? Un itinéraire qui ne
                  vous inspire pas confiance ? Limitez les risques.
                </p>
              </div>
              <div className="slide">
                <h1>Partagez votre trajet</h1>
                <p>
                  En partageant votre trajet, vous rassurez vos accompagnateurs
                  et vous-même, et vous rendez moins vulnérable.
                </p>
              </div>
              <div className="slide">
                <h1>Voyagez en confiance</h1>
                <p>
                  Nous vérifions l&apos;identité de chacun et vous communiquons
                  les informations principales les concernant. Pas de mauvaise
                  surprise.
                </p>
              </div>
            </div>
            <div className="progress-point-container">
              <ProgressPoint total={3} current={currentStep + 1} />
            </div>
          </div>
          <div className="container-buttons">
            <Button
              customStyle={customStyleButtonRegister}
              onClick={redirectToRegister}
            >
              INSCRIPTION
            </Button>
            <Button
              variant="outline"
              customStyle={customStyleButtonLogin}
              onClick={redirectToLogin}
            >
              J'ai déjà un compte
            </Button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default OnBoarding;
