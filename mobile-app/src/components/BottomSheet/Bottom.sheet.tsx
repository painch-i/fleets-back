/** @jsxImportSource @emotion/react */
import { ComponentProps } from 'react';

import { css } from '@emotion/react';
import { IonModal } from '@ionic/react';

import { colors } from '@/styles';

const styles = css({
  '--height': 'auto',
  '.ion-page': {
    justifyContent: 'normal',
    padding: '20px 25px',
    gap: 20,
  },
  '::part(handle)': {
    marginTop: '10px',
    width: '100px',
    backgroundColor: colors.whiteSmoke,
  },
  '::part(content)': {
    borderTopLeftRadius: '30px',
    borderTopRightRadius: '30px',
  },
  '.bottom-sheet-btn:nth-of-type(1)': {
    marginTop: 20,
  },
  '.bottom-sheet-btn': {
    width: '100%',
    height: 65,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '10px 20px',
    gap: 20,
    borderRadius: 15,
    backgroundColor: colors.whiteSmoke,
    border: `1px solid ${colors.border}`,
    ':focus': {
      border: `1px solid ${colors.label}`,
    },
    '& > p': {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.dark,
    },
  },
});

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
 * <BottomSheet isOpen={true}>
 *   <div className="bottom-sheet-btn" tabIndex={0}>
 *      <p>Signaler</p>
 *   </div>
 * </BottomSheet>
 */
const BottomSheet: React.FC<BottomSheetProps> = ({
  children,
  ...props
}: BottomSheetProps): JSX.Element => (
  <IonModal
    initialBreakpoint={1}
    breakpoints={[0, 1]}
    animated
    showBackdrop
    backdropDismiss
    css={styles}
    data-cy="bottom-sheet"
    {...props}
  >
    {children}
  </IonModal>
);

export default BottomSheet;
