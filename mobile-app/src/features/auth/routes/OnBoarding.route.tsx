import { IonContent, IonPage } from '@ionic/react';
import { useNavigate } from 'react-router';
import { useState } from 'react';

import Button from '@/components/Button/Button.global';
import ProgressPoint from '@/components/ProgressPoint/Progress.point';
import OnBoardingSlider from '@/features/auth/components/OnBoarding.slider';

const OnBoarding: React.FC = () => {
  const navigate = useNavigate();

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
    navigate('/login');
  }

  function redirectToRegister(): void {
    navigate('/register');
  }

  return (
    <IonPage>
      <IonContent className="part-[scroll]:flex part-[scroll]:flex-col part-[scroll]:overflow-hidden part-[background]:bg-blue-1000 part-[background]:text-dark">
        <div
          className="z-10 flex size-full flex-col items-center px-5 pb-5"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            className="h-8 w-[50px]"
            src="./assets/logos/logo-white.png"
            alt="fleet-logo"
          />
          <div className="relative flex size-full flex-col items-center justify-center gap-10 overflow-hidden">
            <OnBoardingSlider currentSlideIndex={currentStep} />
            <div className="h-2.5 w-[70px]">
              <ProgressPoint
                total={3}
                current={currentStep + 1}
                className="bg-primary_opaque data-[active=true]:bg-whiteSmoke"
              />
            </div>
          </div>
          <div
            className="flex w-full flex-col items-center gap-5 font-anybody font-bold"
            data-cy="onBoarding-container-buttons"
          >
            <Button
              className="bg-whiteSmoke text-blue-1000"
              onClick={redirectToRegister}
            >
              INSCRIPTION
            </Button>
            <Button
              variant="outline"
              className="bg-transparent text-whiteSmoke"
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
