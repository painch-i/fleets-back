import { HTMLAttributes } from 'react';

export type IconType = HTMLAttributes<SVGElement> & {
  color?: string;
  size?: number;
};
