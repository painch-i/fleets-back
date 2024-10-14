import { HTMLAttributes } from 'react';

import ChevronLeftIcon from '@/assets/icons/ChevronLeft.icon';
import CrossIcon from '@/assets/icons/Cross.icon';

import { IconType } from '@/assets/icons/types/Icon.types';
import { cn } from '@/utils/lib';

export type HeaderProps = HTMLAttributes<HTMLElement> & {
  /**
   * Title of the Header.
   */
  title: string;
  /**
   * Icon for the left part of the Header.
   * @default ChevronLeftIcon
   */
  iconLeft?: IconType;
  /**
   * Icon for the right part of the Header.
   * @default CrossIcon
   */
  iconRight?: IconType;
  /**
   * Callback function triggered when the left Icon is clicked.
   */
  onClickIconLeft?: () => void;
  /**
   * Callback function triggered when the right Icon is clicked.
   */
  onClickIconRight?: () => void;
  /**
   * Determines if the left Icon is displayed or not.
   * @default true
   */
  showIconLeft?: boolean;
  /**
   * Determines if the right Icon is displayed or not.
   * @default false
   */
  showIconRight?: boolean;
};

/**
 * Renders a Header component in Fleets style.
 *
 * @param {HeaderProps} {@link HeaderProps} - Props for the Header component.
 *
 * @returns {JSX.Element} JSX.Element - The rendered Header component.
 *
 * @description This component provides a customizable Header with in Fleets style with Icons.
 *
 * @example
 * <Header
 *    title="Connexion"
 *    onClickIconLeft={redirectToPreviousPage}
 * />
 */
const Header = ({
  title,
  iconLeft,
  iconRight,
  onClickIconLeft,
  onClickIconRight,
  showIconLeft = true,
  showIconRight = false,
  className,
  ...props
}: HeaderProps): JSX.Element => {
  const CurrentIconLeft = iconLeft || ChevronLeftIcon;
  const CurrentIconRight = iconRight || CrossIcon;

  return (
    <header
      {...props}
      className={cn(
        'flex items-center justify-between p-6 text-xl font-bold text-light',
        className,
      )}
      data-cy="header-global"
    >
      <div className="flex h-full w-8 items-center justify-start">
        {(iconLeft || showIconLeft) && (
          <CurrentIconLeft
            size={32}
            color="currentColor"
            onClick={onClickIconLeft}
            data-cy="header-global-left-icon"
          />
        )}
      </div>
      <h4
        className="mx-auto grow truncate text-center font-anybody"
        data-cy="header-global-title"
      >
        {title}
      </h4>
      <div className="flex h-full w-8 items-center justify-end">
        {(iconRight || showIconRight) && (
          <CurrentIconRight
            size={24}
            color="currentColor"
            onClick={onClickIconRight}
            data-cy="header-global-right-icon"
          />
        )}
      </div>
    </header>
  );
};

export default Header;
