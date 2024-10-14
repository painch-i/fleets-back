import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/lib';
import { forwardRef } from 'react';

const inputVariants = cva(
  'w-full border-none !bg-transparent p-0 text-dark placeholder:text-[17px] focus:outline-none',
  {
    variants: {
      variant: {
        default: 'placeholder:font-bold placeholder:text-border',
        outline: 'placeholder:font-normal placeholder:text-medium',
        subtle: 'placeholder:font-normal placeholder:text-medium',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const inputContainerVariants = cva(
  'flex w-full items-center border-solid py-2.5 data-[error=true]:border-danger',
  {
    variants: {
      variant: {
        default: 'border-b border-border',
        outline:
          'h-[50px] rounded-[15px] border border-border bg-light px-[25px] py-2.5',
        subtle:
          'h-[60px] gap-2.5 rounded-[10px] border border-whiteSmoke bg-whiteSmoke px-[15px] py-2.5',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type InputVariantProps = VariantProps<typeof inputVariants>;

type InputProps = React.HTMLProps<HTMLInputElement> &
  InputVariantProps & {
    /**
     * The label for the input.
     */
    label: string;
    /**
     * Error message to be displayed.
     */
    error?: string;
    /**
     * Icon to be displayed within the input.
     */
    icon?: React.ReactNode;
    /**
     * The className property of the container element.
     */
    containerClassName?: string;
  };

/**
 * Renders a custom Input component with support for multiple styles, icons and error messages.
 *
 * @param {InputProps} {@link InputProps} - Props for the Input component, including those inherited from HTMLInputElement.
 *
 * @returns {JSX.Element} JSX.Element - The rendered Input component.
 *
 * @description This component provides a customizable input field with support for various visual styles, icons, and error messages.
 *
 * @example
 * // Basic usage:
 * <Input label="Username" />
 *
 * // Input with an icon:
 * <Input label="Password" icon={<LockIcon />} />
 *
 * // Input with error message:
 * <Input label="Email" error="Invalid email format" />
 */
const Input: React.FC<InputProps> = forwardRef(
  (
    {
      label,
      error,
      icon: Icon,
      variant,
      className,
      containerClassName,
      ...props
    }: InputProps,
    ref,
  ): JSX.Element => (
    <div
      className="flex w-full flex-col justify-around gap-0.5"
      data-cy="input-global"
    >
      <div
        data-error={!!error}
        className={cn(
          inputContainerVariants({ variant, className: containerClassName }),
        )}
      >
        {Icon && <div className="flex w-6 justify-center">{Icon}</div>}
        <input
          {...props}
          ref={ref}
          className={cn(inputVariants({ variant, className }))}
          name={label}
          autoComplete={label}
          aria-multiline={false}
          spellCheck="false"
          required
        />
      </div>
      {error && (
        <p
          className="mt-[5px] text-sm text-danger"
          data-cy="input-global-error"
        >
          {error}
        </p>
      )}
    </div>
  ),
);

export default Input;
