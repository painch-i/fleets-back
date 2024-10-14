import { HTMLAttributes } from 'react';
import { VariantProps, cva } from 'class-variance-authority';

import { Line } from '@/features/search/types/line.types';
import { cn } from '@/utils/lib';
import { LineTaken } from '@/features/search/types/suggestion.types';

const transportIconContainerVariants = cva(
  'relative flex items-center justify-center bg-[var(--background)] px-1',
  {
    variants: {
      variant: {
        rail: 'rounded-[20%]',
        tram: 'rounded-md',
        metro: 'rounded-full',
        bus: 'rounded-md',
      },
    },
    defaultVariants: {
      variant: 'rail',
    },
  },
);

const transportIconVariants = cva(
  'flex flex-col items-center justify-center text-center text-[1rem] font-bold text-[var(--text)]', // Using relative font size (1rem)
  {
    variants: {
      variant: {
        rail: '',
        tram: 'justify-between',
        metro: '',
        bus: '',
      },
    },
    defaultVariants: {
      variant: 'rail',
    },
  },
);

export type TransportIconVariantProps = VariantProps<
  typeof transportIconContainerVariants
>;

type TransportIconOptions = HTMLAttributes<HTMLDivElement> &
  TransportIconVariantProps & {
    line: Line | LineTaken;
    containerClassName?: string;
  };

export const TransportIcon: React.FC<TransportIconOptions> = ({
  line,
  variant,
  containerClassName,
  className,
  ...props
}) => {
  const isTram = variant === 'tram';

  return (
    <div
      {...props}
      style={{
        color: line.textColor,
        backgroundColor: line.color,
        ['--background' as string]: `#${line.color}`,
        ['--text' as string]: `#${isTram ? '000000' : line.textColor}`,
      }}
      className={cn(
        transportIconContainerVariants({
          variant,
          className: containerClassName,
        }),
      )}
      data-cy="transport-icon"
    >
      <div className={cn(transportIconVariants({ variant, className }))}>
        {isTram && (
          <span className="block h-[10%] w-full rounded bg-[var(--background)]" />
        )}
        <p>{line.name}</p>
        {isTram && (
          <span className="block h-[10%] w-full rounded bg-[var(--background)]" />
        )}
      </div>
    </div>
  );
};
