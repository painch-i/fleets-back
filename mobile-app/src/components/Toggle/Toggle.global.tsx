import { ButtonHTMLAttributes } from 'react';
import { IconType } from 'react-icons';

import { cn } from '@/utils/lib';

type ToggleDefaultValues<T> = {
  /**
   * @template T - The type of value this component will handle.
   */
  value: T;
  /**
   * Icon representing the value.
   */
  icon: IconType;
};

type ToggleProps<T> = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange'
> & {
  /**
   * @template T - The type of value this component will handle.
   */
  value: T;
  /**
   * Callback function triggered when the value change.
   */
  onChange: (value: T) => void;
  /**
   * Array containing the default values of the Toggle.
   */
  defaultValues: ToggleDefaultValues<T>[];
  /**
   * Disabled all the toggle options.
   * @default false
   */
  disabled?: boolean;
  /**
   * The className property of the container element.
   */
  containerClassName?: string;
};

type ToggleOptionProps<T> = ToggleDefaultValues<T> &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> & {
    isSelected: boolean;
    onChange: (value: T) => void;
  };

const ToggleOption = <T extends string>({
  onChange,
  isSelected,
  value,
  icon: Icon,
  disabled = false,
  className,
  ...props
}: ToggleOptionProps<T>) => (
  <button
    {...props}
    aria-selected={isSelected}
    className={cn(
      'flex size-full items-center justify-center rounded-md bg-transparent p-2.5 text-primary_opaque aria-selected:bg-primary aria-selected:text-white',
      className,
    )}
    onClick={() => onChange(value)}
    disabled={disabled || isSelected}
    data-cy="toggle-global-option"
  >
    <Icon size={20} color="currentColor" />
  </button>
);

/**
 * Renders a Toggle component.
 *
 * @param {ToggleProps} {@link ToggleProps} - Props for the Toggle component.
 *
 * @returns {JSX.Element} JSX.Element - The Toggle Skeleton component.
 *
 * @example
 * <Toggle
 *  value={"Yes"}
 *  onChange={onGenderChange}
 *  defaultValues={[
 *    { value: "Yes", icon: YesIcon },
 *    { value: "No", icon: NoIcon },
 *  ]}
 * />
 */
const Toggle = <T extends string>({
  value,
  defaultValues,
  containerClassName,
  ...props
}: ToggleProps<T>): JSX.Element => (
  <div
    className={cn(
      'flex h-[60px] w-full items-center gap-3.5 rounded-[10px] bg-whiteSmoke p-1',
      containerClassName,
    )}
    data-cy="toggle-global"
  >
    {defaultValues.map((option) => (
      <ToggleOption
        key={option.value}
        isSelected={value === option.value}
        {...props}
        {...option}
      />
    ))}
  </div>
);

export default Toggle;
