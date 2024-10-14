import { HTMLAttributes } from 'react';

export type IconProps = HTMLAttributes<SVGElement> & {
  color?: string;
  size?: number;
  width?: number;
  height?: number;
};

export type IconType = (props: IconProps) => JSX.Element;
