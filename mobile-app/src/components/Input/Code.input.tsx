import { ChangeEvent, useRef, useState } from 'react';
import { Clipboard } from '@capacitor/clipboard';

import Toolbar from '@/components/Toolbar/Toolbar.global';
import { cn } from '@/utils/lib';

type CodeInputProps = Omit<React.HTMLProps<HTMLInputElement>, 'onChange'> & {
  /**
   * Callback function to handle change in input values.
   */
  onChange: (value: string) => void;
  /**
   * The number of input fields for the code.
   * @default 6
   */
  length?: number;
  /**
   * Display the paste toolbar.
   * @default false
   */
  displayToolbar?: boolean;
};

/**
 * Renders a CodeInput component for entering OTP or others codes.
 *
 * @param {CodeInputProps} {@link CodeInputProps} - Props for the CodeInput component, including those inherited from HTMLInputElement.
 *
 * @returns {JSX.Element} JSX.Element - The rendered CodeInput component.
 *
 * @description This component provides a customizable CodeInput.
 *
 * @example
 * <CodeInput onChange={setOtp} />
 */
const CodeInput: React.FC<CodeInputProps> = ({
  onChange,
  length = 6,
  className,
  displayToolbar = false,
  ...props
}: CodeInputProps): JSX.Element => {
  const [code, setCode] = useState<string[]>(new Array(length).fill(''));

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function handleOnChange(
    e: ChangeEvent<HTMLInputElement>,
    index: number,
  ): void {
    const value = e.target.value;
    const isValueEmpty = value === '';

    if (isValueEmpty || /^\d$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;

      setCode(newCode);
      onChange(newCode.join(''));

      if (!isValueEmpty && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  }

  async function handleOnPaste(): Promise<void> {
    const { value } = await Clipboard.read();

    const sanitizedText = value.replace(/\D/g, '');

    if (sanitizedText.length > 0) {
      const newCode = [...code];
      let index = 0;

      for (let i = 0; i < length; i++) {
        if (index < sanitizedText.length) {
          newCode[i] = sanitizedText[index];
          index++;
          continue;
        }

        break;
      }

      setCode(newCode);
      onChange(newCode.join(''));
    }
  }

  return (
    <div className="relative w-full">
      <div
        className="flex w-full justify-between"
        data-cy="code-input-container"
      >
        {code.map((value, index) => (
          <input
            {...props}
            key={index}
            id={`code-input-${index}`}
            ref={(el) => (inputRefs.current[index] = el)}
            onChange={(e) => handleOnChange(e, index)}
            onPaste={handleOnPaste}
            value={value}
            inputMode="numeric"
            type="number"
            pattern="[0-9]*"
            min={0}
            max={9}
            maxLength={1}
            data-cy={`code-input-${index}`}
            className={cn(
              'size-12 rounded-md border border-solid border-whiteSmoke_darker bg-transparent text-center text-2xl text-dark outline-none focus:border-dark aria-[invalid=true]:border-danger',
              className,
            )}
          />
        ))}
      </div>
      {displayToolbar && <Toolbar onClick={handleOnPaste} />}
    </div>
  );
};

export default CodeInput;
