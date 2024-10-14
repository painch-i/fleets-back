import { HTMLAttributes } from 'react';
import { FaExclamationCircle } from 'react-icons/fa';

import { cn } from '@/utils/lib';

export const defaultErrorMessage =
  'Une erreur est survenue, veuillez réessayer plus tard.';
export const defaultSubErrorMessage =
  'Si le problème persiste, veuillez contacter le support.';

type ErrorMessageProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * The error message to be displayed.
   * Default {@link defaultErrorMessage}
   */
  message?: string;
};

/**
 * Renders an ErrorMessage component for displaying error messages.
 *
 * @param {ErrorMessageProps} {@link ErrorMessageProps} - Props for the ErrorMessage component.
 *
 * @returns {JSX.Element} JSX.Element - The rendered ErrorMessage component.
 *
 * @description This component displays an error message. If no message is provided, the component renders a default one.
 *
 * @example
 * <ErrorMessage message="Invalid input. Please try again." />
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({
  className,
  message = defaultErrorMessage,
  ...props
}: ErrorMessageProps): JSX.Element => (
  <div
    {...props}
    className={cn(
      'my-auto flex w-full flex-col items-center justify-center gap-2.5 text-danger',
      className,
    )}
    data-cy="error-message"
  >
    <FaExclamationCircle size={50} color="currentColor" />
    <p className="text-center text-grey" data-cy="error-message-text">
      {message}
    </p>
    <p
      className="text-center text-xs text-medium"
      data-cy="error-message-subtext"
    >
      {defaultSubErrorMessage}
    </p>
  </div>
);

export default ErrorMessage;
