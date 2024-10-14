import { Fragment } from 'react';
import { FaRunning, FaTrain } from 'react-icons/fa';
import { IoMdPeople, IoMdPin } from 'react-icons/io';
import { IconType } from 'react-icons';

import {
  Fleet,
  GenderConstraintPathAsset,
} from '@/features/fleets/types/fleet.types';
import { useJoinRequestMutation } from '@/features/fleets/api/join-request.mutation';
import AlertModal from '@/components/AlertModal/Alert.modal';
import useVisibilityState from '@/hooks/use-visibility-state.hook';

import { addHoursToDate, formatDateToHoursMinutes } from '@/utils/date';
import { cn } from '@/utils/lib';

type FleetCardFooterItemProps = {
  Icon: IconType;
  children: React.ReactNode;
  className?: string;
};

const FleetCardFooterItem: React.FC<FleetCardFooterItemProps> = ({
  Icon,
  children,
  className,
}) => (
  <div className={cn('flex h-full flex-col justify-between', className)}>
    <Icon className="size-4" color="currentColor" />
    <p className="text-[10px] text-neutral-700">{children}</p>
  </div>
);

type FleetCardProps = {
  data: Fleet;
  startStationName: string;
  endStationName: string;
};

const FleetCard: React.FC<FleetCardProps> = ({ data }) => {
  const {
    members = [],
    name,
    genderConstraint,
    departureTime,
    gatheringTime,
    id,
  } = data;

  // TODO
  const handleOnSuccessJoinRequest = () => {};

  const { open, close, isOpen } = useVisibilityState();
  const { mutate } = useJoinRequestMutation(id, handleOnSuccessJoinRequest);

  const gatheringHours = formatDateToHoursMinutes(new Date(gatheringTime));
  const departureHours = formatDateToHoursMinutes(new Date(departureTime));
  const endHours = formatDateToHoursMinutes(
    addHoursToDate(new Date(departureTime), 1),
  );

  const imageSrc = GenderConstraintPathAsset[genderConstraint];

  const handleOnConfirmValidationModal = () => {
    mutate();
    close();
  };

  return (
    <Fragment>
      <AlertModal
        onClose={close}
        title="Voulez vous rejoindre ce Fleet ?"
        buttonConfirmLabel="Valider"
        description="L'administrateur du Fleet devra accepter votre demande avant que vous puissiez avoir accès à toutes les informations."
        isOpen={isOpen}
        onConfirm={handleOnConfirmValidationModal}
      />
      <div
        className="flex h-[165px] w-full flex-col rounded-[30px] bg-white p-4 text-sm font-normal text-dark shadow-md-unblur shadow-black/15"
        onClick={open}
      >
        <div className="flex flex-[2.5] justify-between gap-7">
          <div className="flex flex-[2] flex-col gap-2.5 pl-1">
            <h1 className="text-xl font-bold">{name}</h1>
            <div className="flex gap-1 font-medium">
              <IoMdPeople className="size-5" color="currentColor" />
              <p>- {members.length + 1}</p>
            </div>
          </div>
          <img className="size-14 object-contain" src={imageSrc} />
        </div>
        {/* TODO -> Faire un meilleur truc pour voir les infos */}
        <div className="flex h-14 gap-1 rounded-[20px] bg-[#EAF0FF] px-3.5 py-2">
          <FleetCardFooterItem Icon={FaRunning}>
            {gatheringHours}
          </FleetCardFooterItem>
          <span className="h-3 w-full border-b border-dashed border-dark" />
          <FleetCardFooterItem Icon={FaTrain} className="items-center">
            {departureHours}
          </FleetCardFooterItem>
          <span className="h-3 w-full border-b border-dashed border-dark" />
          <FleetCardFooterItem Icon={IoMdPin} className="items-end">
            {endHours}
          </FleetCardFooterItem>
        </div>
      </div>
    </Fragment>
  );
};

export default FleetCard;
