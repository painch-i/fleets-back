import { ButtonHTMLAttributes, useEffect, useState } from 'react';
import { Keyboard, KeyboardInfo } from '@capacitor/keyboard';

import { cn } from '@/utils/lib';

const Toolbar: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  ...props
}) => {
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

  useEffect(() => {
    const showKeyboardHandler = (info: KeyboardInfo) => {
      setKeyboardHeight(info.keyboardHeight);
    };
    const hideKeyboardHandler = () => {
      setKeyboardHeight(0);
    };

    Keyboard.addListener('keyboardWillShow', showKeyboardHandler);
    Keyboard.addListener('keyboardWillHide', hideKeyboardHandler);

    return () => {
      Keyboard.removeAllListeners();
    };
  }, []);

  return (
    <div
      data-visible={keyboardHeight !== 0}
      className="invisible fixed left-0 right-0 flex justify-center p-4 transition-all duration-300 ease-in-out data-[visible=true]:visible"
      style={{ bottom: `${keyboardHeight}px` }}
    >
      <button {...props} className={cn('text-primary', className)}>
        Coller depuis le presse-papier
      </button>
    </div>
  );
};

export default Toolbar;
