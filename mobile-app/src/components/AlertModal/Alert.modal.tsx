import { IonModal } from '@ionic/react';

import Button from '@/components/Button/Button.global';

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
    className="px-10 part-[content]:flex part-[content]:h-fit part-[content]:w-full part-[content]:flex-col part-[content]:gap-5 part-[content]:rounded-[13px] part-[content]:bg-light"
    data-cy="alert-modal"
  >
    <div className="flex flex-1 flex-col gap-2.5 p-5 text-center">
      <p className="text-base font-bold" data-cy="alert-modal-title">
        {title}
      </p>
      {description && (
        <p className="text-sm font-normal" data-cy="alert-modal-description">
          {description}
        </p>
      )}
    </div>
    <div className="flex w-full" data-cy="alert-modal-btn-container">
      <Button
        onClick={onCancel || onClose}
        className="rounded-none border-whiteSmoke bg-transparent text-blue-500"
      >
        {buttonCancelLabel}
      </Button>
      {buttonConfirmLabel && onConfirm && (
        <Button
          onClick={onConfirm}
          className="rounded-none border-whiteSmoke bg-transparent text-blue-500"
        >
          {buttonConfirmLabel}
        </Button>
      )}
    </div>
  </IonModal>
);

export default AlertModal;
