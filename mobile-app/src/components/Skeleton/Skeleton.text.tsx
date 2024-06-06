import { IonSkeletonText } from '@ionic/react';

type SkeletonProps = {
  /**
   * Height of the skeleton element.
   */
  h: number | string;
  /**
   * Width of the skeleton element.
   * @default '100%'
   */
  w?: number | string;
  /**
   * Border radius of the skeleton element.
   * @default 10
   */
  radius?: number | string;
};

/**
 * Renders a Skeleton component using Ionic IonSkeletonText.
 *
 * @param {SkeletonProps} {@link SkeletonProps} - Props for the Skeleton component.
 *
 * @returns {JSX.Element} JSX.Element - The rendered Skeleton component.
 *
 * @description This component renders a skeleton loading indicator with customizable height, width and border radius.
 *
 * @example
 * <Skeleton h={20} w={150} radius={20} />
 */
const Skeleton: React.FC<SkeletonProps> = ({
  h,
  w = '100%',
  radius = 10,
}: SkeletonProps): JSX.Element => (
  <IonSkeletonText
    style={{ width: w, height: h, borderRadius: radius }}
    animated
    data-cy="skeleton-text"
  />
);

export default Skeleton;
