import { IconProps } from '@/assets/icons/types/Icon.types';
import { colors } from '@/styles';

const CrossIcon = ({
  size,
  width = 24,
  height = 24,
  color = colors.dark,
  ...props
}: IconProps) => (
  <svg
    width={size || width}
    height={size || height}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      d="M16.875 7.125L7.125 16.875M7.125 7.125L16.875 16.875"
      stroke={color}
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CrossIcon;
