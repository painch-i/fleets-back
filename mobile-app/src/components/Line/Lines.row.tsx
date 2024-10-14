import { ButtonHTMLAttributes, Fragment } from 'react';
import { BiChevronRight } from 'react-icons/bi';

import { TransportIcon } from '@/components/TransportIcon/Transport.icon';
import {
  GoogleVehicleTypeToIDF,
  LineTaken,
} from '@/features/search/types/suggestion.types';
import { cn } from '@/utils/lib';

type LinesRowProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  lines: LineTaken[];
};

const LinesRow = ({ lines, className, ...props }: LinesRowProps) => (
  <button
    {...props}
    className={cn(
      'flex max-w-fit items-center gap-0.5 rounded border border-solid border-gray-300 p-2 aria-selected:border-primary',
      className,
    )}
  >
    {lines.map((line, index) => (
      <Fragment key={`${line.name}-${index}`}>
        <TransportIcon
          line={line}
          variant={GoogleVehicleTypeToIDF[line.vehicle.type]}
          containerClassName="min-w-6"
        />
        {index < lines.length - 1 && <BiChevronRight size={17} />}
      </Fragment>
    ))}
  </button>
);

export default LinesRow;
