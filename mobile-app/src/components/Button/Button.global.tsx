import { ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { IonSpinner } from '@ionic/react';

import { cn } from '@/utils/lib';

const buttonVariants = cva(
  'flex h-[50px] w-full items-center justify-center rounded-[10px] border border-solid border-primary bg-primary text-[17px] font-medium text-white transition delay-300 valid:active:translate-y-0.5',
  {
    variants: {
      variant: {
        default:
          'valid:active:border-primary_darker valid:active:bg-primary_darker disabled:data-[loading=false]:border-label disabled:data-[loading=false]:bg-label',
        outline:
          'border-border bg-whiteSmoke font-bold text-dark valid:active:bg-whiteSmoke_darker disabled:data-[loading=false]:bg-[#dce1f0] disabled:data-[loading=false]:text-medium',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariantProps & {
    /**
     * Indicates whether the Button is in a loading state.
     * When set to true, user interactions are disabled and a loader is displayed.
     * @default false
     */
    isLoading?: boolean;
  };

/**
 * Renders a Button component with variants style.
 *
 * @param {ButtonProps} {@link ButtonProps} - Props for the Button component, including those inherited from HTMLButtonElement.
 *
 * @returns {JSX.Element} JSX.Element - The rendered Button component.
 *
 * @description This component provides a customizable Button with pre-made CSS variants style.
 *
 * @example
 * <Button variant="outline" onClick={handleOnClick}>
 *   Annuler
 * </Button>
 */
const Button: React.FC<ButtonProps> = ({
  variant,
  className,
  isLoading = false,
  disabled = false,
  children,
  ...props
}: ButtonProps): JSX.Element => (
  <button
    {...props}
    data-loading={isLoading}
    className={cn(buttonVariants({ variant, className }))}
    disabled={isLoading || disabled}
    data-cy="button-global"
  >
    {isLoading ? (
      <IonSpinner name="crescent" color="currentColor" className="text-light" />
    ) : (
      children
    )}
  </button>
);

export default Button;
