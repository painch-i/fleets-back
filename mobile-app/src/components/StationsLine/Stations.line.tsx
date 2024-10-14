import { cn } from '@/utils/lib';

interface StationsLineOptions {
  className?: string;
}

export const StationsLine: React.FC<StationsLineOptions> = ({
  className,
}: StationsLineOptions) => (
  <div
    className={cn('relative flex h-full w-5 flex-col items-center', className)}
  >
    <div className="size-[15px] rounded-full bg-dark" />
    <div className="w-[3px] flex-1 bg-dark" />
    <div className="size-3.5 rounded-full border border-dark" />
  </div>
);
