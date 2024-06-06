/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import { colors } from '@/styles';

const styles = css({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: 10,
  '.point': {
    flex: 1,
    height: 10,
    borderRadius: '50%',
    backgroundColor: colors.medium,
    transition: 'flex 0.4s ease',
  },
  '.active': {
    flexGrow: 3,
    borderRadius: 15,
    backgroundColor: colors.dark,
  },
});

interface ProgressPointProps {
  /**
   * The total number of points in the progress indicator.
   */
  total: number;
  /**
   * The current active point in the progress indicator.
   */
  current: number;
}

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
}: ProgressPointProps): JSX.Element => (
  <div css={styles} data-cy="progress-point">
    {Array.from({ length: total }, (_, index) => (
      <div
        key={index + 1}
        className={`point ${index + 1 === current ? 'active' : ''}`}
      />
    ))}
  </div>
);

export default ProgressPoint;
