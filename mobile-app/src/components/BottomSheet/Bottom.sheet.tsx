import { ButtonHTMLAttributes, ComponentProps } from 'react';
import { IonModal } from '@ionic/react';

import { cn } from '@/utils/lib';

interface BottomSheetProps extends ComponentProps<typeof IonModal> {
  children?: React.ReactNode;
}

/**
 * Renders a BottomSheet component using Ionic modal.
 *
 * @param {BottomSheetProps} {@link BottomSheetProps} - Props for the BottomSheet component, including those inherited from Ionic modal and the children prop.
 *
 * @returns {JSX.Element} JSX.Element - The rendered BottomSheet component.
 *
 * @description This component provides a customizable bottomSheet modal with pre-made CSS classes applied to children ("btn-bottomSheet").
 *
 * @example
 * <BottomSheet.Root isOpen={true}>
 *   <BottomSheet.Button>
 *      <p>Signaler</p>
 *   </BottomSheet.Button>
 * </BottomSheet.Root>
 */
export const BottomSheetRoot: React.FC<BottomSheetProps> = ({
  children,
  ...props
}: BottomSheetProps): JSX.Element => (
  <IonModal
    initialBreakpoint={1}
    breakpoints={[0, 1]}
    animated
    showBackdrop
    backdropDismiss
    className="part-[handle]:mt-2.5 part-[handle]:w-24 part-[content]:rounded-t-[30px] part-[handle]:bg-whiteSmoke part-[content]:py-5"
    data-cy="bottom-sheet"
    {...props}
  >
    <div className="flex flex-col gap-5 px-6">{children}</div>
  </IonModal>
);

type BottomSheetButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode;
};

export const BottomSheetButton: React.FC<BottomSheetButtonProps> = ({
  className,
  children,
  ...props
}): JSX.Element => (
  <button
    className={cn(
      'flex h-16 w-full items-center justify-start gap-5 rounded-[15px] border border-solid border-border bg-whiteSmoke px-5 py-2.5 text-lg font-bold text-dark first-of-type:mt-5 focus:border-label',
      className,
    )}
    {...props}
  >
    {children}
  </button>
);

const BottomSheet = {
  Root: BottomSheetRoot,
  Button: BottomSheetButton,
};

export default BottomSheet;
