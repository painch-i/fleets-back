import { useEffect, useState } from 'react';

import useLocalStorage from '@/hooks/use-local-storage.hook';
import { LAST_OTP_SENT_KEY } from '@/constants/local-storage.const';

type OtpCountdownProps = {
  onClick: () => Promise<void>;
};

const OtpCountdown = ({ onClick }: OtpCountdownProps) => {
  const { storedValue, setValue } = useLocalStorage<number>(
    LAST_OTP_SENT_KEY,
    0,
  );

  const [countdown, setCountdown] = useState<number>(0);

  useEffect(() => {
    const initialCountdown = Math.max(
      0,
      Math.ceil((60000 - (Date.now() - storedValue)) / 1000),
    );
    setCountdown(initialCountdown);

    if (initialCountdown > 0) {
      const interval = setInterval(() => {
        setCountdown((prevState) => {
          if (prevState <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prevState - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [storedValue]);

  async function handleClick(): Promise<void> {
    await onClick();

    setCountdown(60);
    setValue(Date.now());
  }

  return (
    <p className="whitespace-pre-line text-[15px] font-light leading-normal text-label">
      Un problème avec le code ? {'\n'}
      {countdown > 0 ? (
        <span>Renvoyer dans {countdown}s</span>
      ) : (
        <span
          onClick={handleClick}
          className="text-primary underline decoration-1 underline-offset-2"
        >
          Renvoyer !
        </span>
      )}
    </p>
  );
};

export default OtpCountdown;
