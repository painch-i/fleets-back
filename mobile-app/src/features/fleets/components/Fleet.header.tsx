import { useNavigate } from 'react-router';
import { FaExclamationTriangle } from 'react-icons/fa';
import { IoMdExit } from 'react-icons/io';
import { TbDots } from 'react-icons/tb';

import BottomSheet from '@/components/BottomSheet/Bottom.sheet';
import Header from '@/components/Header/Header.global';
import { useCurrentFleet } from '@/features/fleets/providers/current-fleet.provider';
import {
  FleetStatus,
  FleetStatusLabel,
} from '@/features/fleets/types/fleet.types';
import useVisibilityState from '@/hooks/use-visibility-state.hook';

// TODO -> Mettre un petit btn en bas à gauche qui servira de btn d'urgence

const FleetHeader = () => {
  const navigate = useNavigate();

  const { fleet, countDown, extendedStatus } = useCurrentFleet();
  const { isOpen, open, close } = useVisibilityState(false);
  const { name, endStation } = fleet;

  function handleGoingBack(): void {
    if (history.length > 2) {
      history.back();
      return;
    }

    navigate('/tabs/search');
  }

  return (
    <div className="flex h-1/3 w-full flex-col">
      <Header
        className=""
        title={name}
        iconRight={TbDots}
        onClickIconLeft={handleGoingBack}
        onClickIconRight={open}
        showIconRight
      />
      <div className="flex flex-1 items-center justify-center p-6 pb-12">
        <p className="text-center text-[26px] font-medium text-light">
          {extendedStatus === FleetStatus.TRAVELING
            ? FleetStatusLabel[extendedStatus](endStation.name)
            : FleetStatusLabel[extendedStatus](countDown)}
        </p>
      </div>
      <BottomSheet.Root isOpen={isOpen} onWillDismiss={close}>
        <BottomSheet.Button>
          <FaExclamationTriangle />
          <p>Signaler</p>
        </BottomSheet.Button>
        <BottomSheet.Button>
          <IoMdExit size={20} />
          <p>Quitter</p>
        </BottomSheet.Button>
      </BottomSheet.Root>
    </div>
  );
};

export default FleetHeader;
