/** @jsxImportSource @emotion/react */

import { Fragment } from 'react';
import { css } from '@emotion/react';
import { FaRunning, FaTrain } from 'react-icons/fa';
import { IoMdPin } from 'react-icons/io';

import {
  Fleet,
  GenderConstraintLabels,
  GenderConstraintPathAsset,
} from '@/features/fleets/types/fleet.types';
import { useJoinRequestMutation } from '@/features/fleets/api/join-request.mutation';
import AlertModal from '@/components/AlertModal/Alert.modal';
import useVisibilityState from '@/hooks/use-visibility-state.hook';

import { addHoursToDate, formatDateToHoursMinutes } from '@/utils/date';
import { colors } from '@/styles';

const styles = css({
  width: '100%',
  height: '180px',
  padding: '15px',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '30px',
  backgroundColor: colors.whiteSmoke,
  boxShadow: '0 4px 10px 0px  rgba(0, 0, 0, 0.25)',
  '& .header': {
    flex: 2.5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: '30px',
  },
  '& .textContainer': {
    flex: 2,
    display: 'flex',
    flexDirection: 'column',
    padding: '0 5px',
    gap: '10px',
  },
  p: {
    fontSize: '14px',
    fontWeight: '400',
    color: colors.grey,
  },
  h1: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  '.imgContainer': {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    img: {
      width: '71px',
      height: '71px',
    },
  },
  '.footer': {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    padding: '10px 15px',
    gap: '5px',
    borderRadius: '20px',
    backgroundColor: '#DDE4F6',
    '& > .routeContainerCol': {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      '& > p': {
        fontSize: 10,
      },
    },
    '& > .routeContainerCol:nth-of-type(2)': {
      alignItems: 'center',
    },
    '& > .routeContainerCol:nth-of-type(3)': {
      alignItems: 'end',
    },
    '& > .line': {
      width: '100%',
      height: 12,
      borderBottom: `1px dashed ${colors.dark}`,
    },
  },
  h3: {
    fontSize: '12px',
    fontWeight: '600',
  },
});

interface FleetCardProps {
  data: Fleet;
  startStationName: string;
  endStationName: string;
}

export const FleetCard: React.FC<FleetCardProps> = ({ data }) => {
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

  const membersInText =
    members.length > 1 ? ' personnes présentes' : ' personne présente';

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
      <div css={styles} onClick={open}>
        <div className="header">
          <div className="textContainer">
            <h1>{name}</h1>
            <p>
              {GenderConstraintLabels[genderConstraint]} - {members.length + 1}
              {membersInText}
            </p>
          </div>
          <div className="imgContainer">
            <img src={imageSrc} />
          </div>
        </div>
        {/* TODO -> Faire un meilleur truc pour voir les infos */}
        <div className="footer">
          <div className="routeContainerCol">
            <FaRunning size={18} color={colors.dark} />
            <p>{gatheringHours}</p>
          </div>
          <span className="line" />
          <div className="routeContainerCol">
            <FaTrain size={18} color={colors.dark} />
            <p>{departureHours}</p>
          </div>
          <span className="line" />
          <div className="routeContainerCol">
            <IoMdPin size={18} color={colors.dark} />
            <p>{endHours}</p>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
