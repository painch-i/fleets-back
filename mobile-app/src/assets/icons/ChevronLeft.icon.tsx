import { IconProps } from '@/assets/icons/types/Icon.types';
import { colors } from '@/styles';

const ChevronLeftIcon = ({
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
      d="M8.5 18L2.5 12L8.5 6L9.9 7.4L5.3 12L9.9 16.6L8.5 18Z"
      fill={color}
    />
  </svg>
);

export default ChevronLeftIcon;
