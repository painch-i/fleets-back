/** @jsxImportSource @emotion/react */
import { ButtonHTMLAttributes } from 'react';

import { css, SerializedStyles } from '@emotion/react';
import { IonSpinner } from '@ionic/react';

import { colors } from '@/styles';

const styles = (isLoading: boolean) =>
  css({
    width: '100%',
    height: 50,
    borderRadius: 10,
    backgroundColor: colors.primary,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'background-color 0.3s, border-color 0.3s, transform 0.2s',
    border: `1px solid ${colors.primary}`,
    fontWeight: 500,
    fontSize: 17,
    color: 'white',
    ...(!isLoading && {
      ':disabled, [disabled]': {
        backgroundColor: colors.label,
        border: `1px solid ${colors.label}`,
      },
    }),
    ':active:not([disabled])': {
      transform: 'translateY(2px)',
    },
    '& ion-spinner': {
      '--color': colors.light,
    },
  });

const variants: Record<VariantTypes, SerializedStyles> = {
  default: css({
    ':active:not([disabled])': {
      backgroundColor: colors.primary_darker,
      border: `1px solid ${colors.primary_darker}`,
    },
  }),
  outline: css({
    backgroundColor: colors.whiteSmoke,
    border: `1px solid ${colors.border}`,
    color: 'black',
    fontWeight: 'bold',
    ':disabled, [disabled]': {
      backgroundColor: '#DCE1F0',
      cursor: 'not-allowed',
      color: colors.medium,
    },
    ':active:not([disabled])': {
      backgroundColor: colors.whiteSmoke_darker,
    },
  }),
};

type VariantTypes = 'default' | 'outline';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /**
   * Indicates whether the Button is in a loading state.
   * When set to true, user interactions are disabled and a loader is displayed.
   * @default false
   */
  isLoading?: boolean;
  /**
   * Custom styles to be applied to the Button using Emotion's SerializedStyles
   */
  customStyle?: SerializedStyles;
  /**
   * The current CSS variants style of the Button.
   * @default 'default'
   */
  variant?: VariantTypes;
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
  variant = 'default',
  customStyle,
  isLoading = false,
  disabled = false,
  children,
  ...props
}: ButtonProps): JSX.Element => (
  <button
    css={[styles(isLoading), variants[variant], customStyle && customStyle]}
    {...props}
    disabled={isLoading || disabled}
    data-cy="button-global"
  >
    {isLoading ? <IonSpinner name="crescent" /> : children}
  </button>
);

export default Button;
