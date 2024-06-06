/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { FaExclamationCircle } from 'react-icons/fa';

import { colors } from '@/styles';

const styles = css({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  margin: 'auto 0',
  gap: '10px',
  '& > p': {
    textAlign: 'center',
    color: colors.grey,
  },
  '& > .subText': {
    color: colors.medium,
    fontSize: '12px',
  },
});

export const defaultErrorMessage =
  'Une erreur est survenue, veuillez réessayer plus tard.';
export const defaultSubErrorMessage =
  'Si le problème persiste, veuillez contacter le support.';

type ErrorMessageProps = {
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
  message = defaultErrorMessage,
}: ErrorMessageProps): JSX.Element => (
  <div css={styles} className="ErrorMessage" data-cy="error-message">
    <FaExclamationCircle size={50} color={colors.danger} />
    <p data-cy="error-message-text">{message}</p>
    <p className="subText" data-cy="error-message-subtext">
      {defaultSubErrorMessage}
    </p>
  </div>
);

export default ErrorMessage;
