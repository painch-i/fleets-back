/** @jsxImportSource @emotion/react */

import { css, SerializedStyles } from '@emotion/react';

import { colors } from '@/styles';

const styles = (hasError: boolean) =>
  css({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    gap: 2,
    '& > .input-container': {
      display: 'flex',
      width: '100%',
      padding: '10px 0',
      alignItems: 'center',
      borderBottom: `1px solid ${colors.border}`,
      ...(hasError && {
        borderBottom: `1px solid ${colors.danger}`,
      }),
      '& > .icon-container': {
        display: 'flex',
        justifyContent: 'center',
        width: 25,
      },
      '& > input': {
        width: '100%',
        border: 'none',
        backgroundColor: 'transparent !important',
        padding: 0,
        '::placeholder': {
          fontSize: 17,
          fontWeight: 'normal',
          color: colors.medium,
        },
        ':focus': {
          outline: 'none',
        },
        ':-webkit-autofill, :autofill': {
          backgroundColor: 'transparent !important',
          appearance: 'none',
        },
      },
    },
    '.errorTxt': {
      color: colors.danger,
      marginTop: 5,
      fontSize: 14,
    },
  });

const variants: Record<VariantTypes, SerializedStyles> = {
  default: css({
    '& > input::placeholder': {
      fontWeight: 'bold',
      color: colors.border,
    },
  }),
  outline: css({
    '& > .input-container': {
      height: 50,
      padding: '10px 25px',
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.light,
      borderRadius: 15,
    },
  }),
  subtle: css({
    '& > .input-container': {
      height: 60,
      backgroundColor: colors.whiteSmoke,
      border: `1px solid ${colors.whiteSmoke}`,
      borderRadius: 10,
      padding: '10px 15px',
      gap: 10,
      '& > input': {
        color: colors.dark,
      },
    },
  }),
};

type VariantTypes = 'default' | 'outline' | 'subtle';

type InputProps = React.HTMLProps<HTMLInputElement> & {
  /**
   * The label for the input.
   */
  label: string;
  /**
   * Custom styles to be applied to the Input using Emotion's SerializedStyles
   */
  customStyle?: SerializedStyles;
  /**
   * Error message to be displayed.
   */
  error?: string;
  /**
   * Icon to be displayed within the input.
   */
  icon?: React.ReactNode;
  /**
   * The current CSS variants style of the Input.
   * @default 'default'
   */
  variant?: VariantTypes;
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
const Input: React.FC<InputProps> = ({
  label,
  customStyle,
  error,
  icon: Icon,
  variant = 'default',
  ...props
}: InputProps): JSX.Element => (
  <div
    css={[styles(!!error), variants[variant], customStyle && customStyle]}
    data-cy="input-global"
  >
    <div className="input-container">
      {Icon && <div className="icon-container">{Icon}</div>}
      <input
        name={label}
        autoComplete={label}
        aria-multiline={false}
        spellCheck="false"
        required
        {...props}
      />
    </div>
    {error && (
      <p className="errorTxt" data-cy="input-global-error">
        {error}
      </p>
    )}
  </div>
);

export default Input;
