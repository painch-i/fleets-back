/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { useIonRouter } from '@ionic/react';
import { FaChevronLeft } from 'react-icons/fa';
import { FaExclamationTriangle } from 'react-icons/fa';
import { IoMdExit } from 'react-icons/io';
import { TbDots } from 'react-icons/tb';

import BottomSheet from '@/components/BottomSheet/Bottom.sheet';
import { useCurrentFleet } from '@/features/fleets/providers/current-fleet.provider';
import {
  FleetStatus,
  FleetStatusLabel,
} from '@/features/fleets/types/fleet.types';
import useVisibilityState from '@/hooks/use-visibility-state.hook';
import { colors } from '@/styles';

const styles = css({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '30%',
  '& > .text-container': {
    flex: 1,
    display: 'flex',
    padding: 25,
    paddingBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
    '& > p': {
      fontSize: 26,
      color: colors.light,
      fontWeight: '500',
      textAlign: 'center',
    },
  },
  '& > .icon-container': {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    padding: 25,
    gap: 25,
    alignItems: 'center',
    justifyContent: 'space-between',
    '& > h3': {
      color: colors.light,
      fontWeight: 'bold',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    },
  },
});

// TODO -> Mettre un petit btn en bas à gauche qui servira de btn d'urgence

const FleetHeader = () => {
  const router = useIonRouter();

  const { fleet, countDown, extendedStatus } = useCurrentFleet();
  const { isOpen, open, close } = useVisibilityState(false);
  const { name, endStation } = fleet;

  function handleGoingBack(): void {
    if (router.canGoBack()) {
      router.goBack();
      return;
    }

    router.push('/tabs/search');
  }

  return (
    <div css={styles}>
      <div className="icon-container">
        <FaChevronLeft size={20} color="white" onClick={handleGoingBack} />
        <h3>{name}</h3>
        <TbDots size={25} color="white" onClick={open} />
      </div>
      <div className="text-container">
        <p>
          {extendedStatus === FleetStatus.TRAVELING
            ? FleetStatusLabel[extendedStatus](endStation.name)
            : FleetStatusLabel[extendedStatus](countDown)}
        </p>
      </div>
      <BottomSheet isOpen={isOpen} onWillDismiss={close}>
        <div className="bottom-sheet-btn" tabIndex={0}>
          <FaExclamationTriangle />
          <p>Signaler</p>
        </div>
        <div className="bottom-sheet-btn" tabIndex={0}>
          <IoMdExit size={20} />
          <p>Quitter</p>
        </div>
      </BottomSheet>
    </div>
  );
};

export default FleetHeader;
