import { HTMLAttributes } from 'react';
import { IonSkeletonText } from '@ionic/react';
import { cn } from '@/utils/lib';

/**
 * Renders a Skeleton component using Ionic IonSkeletonText.
 *
 * @param {HTMLAttributes<HTMLIonSkeletonTextElement>} {@link HTMLAttributes<HTMLIonSkeletonTextElement>} - Props for the Skeleton component.
 *
 * @returns {JSX.Element} JSX.Element - The rendered Skeleton component.
 *
 * @description This component renders a skeleton loading indicator with customizable height, width and border radius.
 *
 * @example
 * <Skeleton className="size-5 rounded" />
 */
const Skeleton: React.FC<HTMLAttributes<HTMLIonSkeletonTextElement>> = ({
  className,
  ...props
}: HTMLAttributes<HTMLIonSkeletonTextElement>): JSX.Element => (
  <IonSkeletonText
    {...props}
    className={cn('w-full rounded-[10px]', className)}
    animated
    data-cy="skeleton-text"
  />
);

export default Skeleton;
