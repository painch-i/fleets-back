/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { IonModal } from '@ionic/react';

import Button from '@/components/Button/Button.global';
import { colors } from '@/styles';

const styles = css({
  padding: '0px 40px',
  '::part(content)': {
    width: '100%',
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    backgroundColor: colors.light,
    borderRadius: 13,
  },
  '.buttons-container': {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  '.alert-content': {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    gap: 10,
    padding: 20,
  },
  '.alert-content-title': {
    fontSize: 17,
    fontWeight: 'bold',
  },
  '.alert-content-description': {
    fontSize: 14,
    fontWeight: 400,
  },
});

const cancelButtonCustomStyle = css({
  backgroundColor: 'transparent',
  borderRadius: 0,
  border: `1px solid ${colors.whiteSmoke}`,
  color: 'rgb(34, 139, 230)',
});

type AlertModalProps = {
  /**
   * Callback function to handle closing the AlertModal.
   */
  onClose: () => void;
  /**
   * Title of the AlertModal.
   */
  title: string;
  /**
   * Label for the cancel button.
   * @default "Annuler"
   */
  buttonCancelLabel?: string;
  /**
   * The label text to display on the confirm button.
   */
  buttonConfirmLabel?: string;
  /**
   * Description or message content for the AlertModal.
   */
  description?: string;
  /**
   * Determines if the AlertModal is open or closed.
   * @default false
   */
  isOpen?: boolean;
  /**
   * Callback function triggered when the cancel button is clicked.
   */
  onCancel?: () => void;
  /**
   * Callback function triggered when the confirm button is clicked.
   */
  onConfirm?: () => void;
};

/**
 * Renders an AlertModal component using Ionic modal.
 *
 * @param {AlertModalProps} {@link AlertModalProps} - Props for the AlertModal component.
 *
 * @returns {JSX.Element} JSX.Element - The rendered AlertModal component.
 *
 * @description This component provides a customizable AlertModal that can be used for various purposes like confirming actions or displaying messages.
 *
 * @example
 * ```tsx
 * <AlertModal
 *   onClose={() => {}}
 *   onConfirm={() => {}}
 *   title="Confirmation"
 *   description="Are you sure you want to proceed?"
 *   buttonCancelLabel="Cancel"
 *   buttonConfirmLabel="Confirm"
 *   isOpen={true}
 * />
 * ```
 */
const AlertModal: React.FC<AlertModalProps> = ({
  onClose,
  title,
  buttonCancelLabel = 'Annuler',
  buttonConfirmLabel,
  description,
  isOpen = false,
  onCancel,
  onConfirm,
}: AlertModalProps) => (
  <IonModal
    isOpen={isOpen}
    showBackdrop
    onDidDismiss={onClose}
    css={styles}
    data-cy="alert-modal"
  >
    <div className="alert-content">
      <p className="alert-content-title" data-cy="alert-modal-title">
        {title}
      </p>
      {description && (
        <p
          className="alert-content-description"
          data-cy="alert-modal-description"
        >
          {description}
        </p>
      )}
    </div>
    <div className="buttons-container" data-cy="alert-modal-btn-container">
      <Button
        onClick={onCancel || onClose}
        customStyle={cancelButtonCustomStyle}
      >
        {buttonCancelLabel}
      </Button>
      {buttonConfirmLabel && onConfirm && (
        <Button onClick={onConfirm} customStyle={cancelButtonCustomStyle}>
          {buttonConfirmLabel}
        </Button>
      )}
    </div>
  </IonModal>
);

export default AlertModal;
