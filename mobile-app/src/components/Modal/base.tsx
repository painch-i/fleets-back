import { ComponentProps } from 'react';
import { IonModal } from '@ionic/react';

import type { ConstantValues } from '@/types/utils';
import { useQueryParam } from '@/hooks/use-query-param.hook';
import { cn } from '@/utils/lib';
import { MODAL_TYPE } from '@/constants/mappings';

type ModalProps = {
  containerClassName?: string;
  modalKey: ConstantValues<typeof MODAL_TYPE>;
} & ComponentProps<typeof IonModal>;

const ModalBase = ({
  modalKey,
  children,
  containerClassName,
  className,
  showBackdrop = true,
  onDidDismiss,
  ...props
}: ModalProps) => {
  const { removeQueryParam, exist } = useQueryParam(modalKey);

  return (
    <IonModal
      {...props}
      isOpen={exist}
      onDidDismiss={(e) => {
        removeQueryParam();
        onDidDismiss?.(e);
      }}
      showBackdrop
      className={cn(
        'part-[content]:h-1/2 part-[content]:w-5/6 part-[content]:rounded-[13px] part-[content]:bg-white part-[content]:p-5',
        containerClassName,
      )}
      data-cy={`${modalKey}-modal`}
    >
      {/* TODO -> When removing ionic -> remove the containerClassName and do everything in the className of the new modal (We do this now cause ionic styling is weird) */}
      <div
        className={cn('flex h-full flex-col gap-5 overflow-hidden', className)}
      >
        {children}
      </div>
    </IonModal>
  );
};

export default ModalBase;
