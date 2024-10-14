import { ONBOARDING_SLIDES } from '@/features/auth/constants/labels.const';

type OnBoardingSliderProps = {
  currentSlideIndex: number;
};

const OnBoardingSlider = ({ currentSlideIndex }: OnBoardingSliderProps) => (
  <div
    className="flex w-[inherit] transition-transform duration-[400ms]"
    style={{ transform: `translateX(-${currentSlideIndex * 100}%)` }}
    data-cy="onBoarding-container-slides"
  >
    {ONBOARDING_SLIDES.map((slide, i) => (
      <div
        className="flex shrink-0 grow-0 basis-full flex-col gap-9 text-center text-whiteSmoke"
        data-cy={`onBoarding-slide-${i}`}
        key={i}
      >
        <h1 className="text-[47px] uppercase">{slide.title}</h1>
        <p className="text-base leading-normal">{slide.description}</p>
      </div>
    ))}
  </div>
);

export default OnBoardingSlider;
