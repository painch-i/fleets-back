/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { IconType } from 'react-icons';

import { colors } from '@/styles';

const styles = css({
  width: '100%',
  height: 60,
  padding: '5px',
  display: 'flex',
  flexDirection: 'row',
  gap: 15,
  borderRadius: 10,
  alignItems: 'center',
  backgroundColor: colors.whiteSmoke,
  '.option': {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'transparent',
  },
  '.activate': {
    backgroundColor: colors.primary,
  },
});

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

type ToggleProps<T> = {
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
  defaultValues: [ToggleDefaultValues<T>, ToggleDefaultValues<T>];
};

type ToggleOptionProps<T> = ToggleDefaultValues<T> & {
  isSelected: boolean;
  onChange: (value: T) => void;
};

const ToggleOption = <T extends string>({
  onChange,
  isSelected,
  value,
  icon: Icon,
}: ToggleOptionProps<T>) => (
  <button
    className={`option ${isSelected && 'activate'}`}
    onClick={() => onChange(value)}
    disabled={isSelected}
    data-cy="toggle-global-option"
  >
    <Icon size={20} color={isSelected ? 'white' : colors.primary_opaque} />
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
  onChange,
  defaultValues,
}: ToggleProps<T>): JSX.Element => (
  <div css={styles} data-cy="toggle-global">
    {defaultValues.map((props) => (
      <ToggleOption
        key={props.value}
        isSelected={value === props.value}
        onChange={onChange}
        {...props}
      />
    ))}
  </div>
);

export default Toggle;
