import { HTMLAttributes } from 'react';

import { cn } from '@/utils/lib';

type ProgressPointProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * The total number of points in the progress indicator.
   */
  total: number;
  /**
   * The current active point in the progress indicator.
   */
  current: number;
};

/**
 * Renders a ProgressPoint component.
 *
 * @param {ProgressPointProps} {@link ProgressPointProps} - Props for the ProgressPoint component.
 *
 * @returns {JSX.Element} JSX.Element - The rendered Skeleton component.
 *
 * @description This component renders a progress indicator with points.
 *
 * @example
 * <ProgressPoint total={4} current={1} />
 */
const ProgressPoint: React.FC<ProgressPointProps> = ({
  total,
  current,
  className,
  ...props
}: ProgressPointProps): JSX.Element => (
  <div
    className="flex size-full justify-between gap-2.5"
    data-cy="progress-point"
  >
    {Array.from({ length: total }, (_, index) => (
      <div
        {...props}
        key={index + 1}
        data-active={index + 1 === current}
        className={cn(
          'h-2.5 flex-1 rounded-full bg-medium transition-[flex] duration-[400ms] data-[active=true]:grow-[3] data-[active=true]:rounded-[15px] data-[active=true]:bg-dark',
          className,
        )}
      />
    ))}
  </div>
);

export default ProgressPoint;
