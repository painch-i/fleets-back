import { useState, useCallback } from 'react';

type VisibilityStateOptions = {
  /** A boolean indicating whether the modal is open or closed. */
  isOpen: boolean;
  /** Function to open the modal. */
  open: () => void;
  /** Function to close the modal. */
  close: () => void;
  /** Function to toggle the modal's visibility. */
  toggle: () => void;
};

type CallbacksOptions = {
  /** Callback function to be invoked when the modal is opened. */
  onOpen?: () => void;
  /** Callback function to be invoked when the modal is closed. */
  onClose?: () => void;
};

/**
 * A custom hook for managing modal's visibility state.
 *
 * @param {boolean} initialState - The initial state of the modal's visibility (default: false).
 *
 * @param {CallbacksOptions} callbacks - Callbacks to be invoked on modal open and close events. (Optional)
 *
 * @returns {VisibilityStateOptions} {@link VisibilityStateOptions} - Object containing visibility state and control functions.
 */
const useVisibilityState = (
  initialState: boolean = false,
  callbacks?: CallbacksOptions,
): VisibilityStateOptions => {
  const { onOpen, onClose } = (callbacks || {}) as CallbacksOptions;
  const [isOpen, setIsOpen] = useState<boolean>(initialState);

  const open: () => void = useCallback(() => {
    setIsOpen((isOpen) => {
      if (!isOpen) {
        onOpen?.();
        return true;
      }

      return isOpen;
    });
  }, [onOpen]);

  const close: () => void = useCallback(() => {
    setIsOpen((isOpen) => {
      if (isOpen) {
        onClose?.();
        return false;
      }

      return isOpen;
    });
  }, [onClose]);

  const toggle: () => void = useCallback(() => {
    isOpen ? close() : open();
  }, [close, open, isOpen]);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
};

export default useVisibilityState;
