import { IonContent, IonHeader, IonPage } from '@ionic/react';
import { useQueryClient } from '@tanstack/react-query';
import React, { Fragment, useState } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { IoMdAddCircle, IoMdRemoveCircle } from 'react-icons/io';
import { useNavigate } from 'react-router';

import { useCurrentUser } from '@/features/auth/providers/current-user.provider';
import {
  FLEET_REQUESTS_LIST_API_PATH,
  useFleetJoinRequestListQuery,
} from '@/features/fleets/api/join-requests.query';
import { useRemoveMemberFleetMutation } from '@/features/fleets/api/remove-member-fleet.mutation';
import { useRespondToRequestMutation } from '@/features/fleets/api/respond-to-request.mutation';
import { useCurrentFleet } from '@/features/fleets/providers/current-fleet.provider';
import useVisibilityState from '@/hooks/use-visibility-state.hook';
import { getUserDisplayName } from '@/utils/user';

import AlertModal from '@/components/AlertModal/Alert.modal';
import BottomSheet from '@/components/BottomSheet/Bottom.sheet';
import Header from '@/components/Header/Header.global';
import RefreshOnPull from '@/components/RefreshOnPull/RefreshOnPull.component';
import Skeleton from '@/components/Skeleton/Skeleton.text';
import MemberSettings from '@/features/fleets/components/Member.settings';

import { User } from '@/features/auth/types/user.types';
import {
  FleetStatus,
  MemberOptions,
  MemberOptionsLabel,
} from '@/features/fleets/types/fleet.types';
import {
  JoinRequest,
  JoinRequestStatus,
} from '@/features/fleets/types/joinRequest.types';

import { colors } from '@/styles';

export const Members: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { user } = useCurrentUser();
  const { fleet, isCurrentUserAdmin, invalidateCurrentFleetQuery, isFetching } =
    useCurrentFleet();

  const { data: joinRequests = [], isFetching: isLoadingJoinRequestList } =
    useFleetJoinRequestListQuery(fleet.id, isCurrentUserAdmin);

  const { mutate: removeMember, isPending: isLoadingRemoveMemberMutation } =
    useRemoveMemberFleetMutation(fleet.id, invalidateCurrentFleetQuery);

  const { mutate, isPending: isLoadingJoinRequestMutation } =
    useRespondToRequestMutation(fleet.id, () => {
      resetCurrentFleetJoinRequestQuery();
      invalidateCurrentFleetQuery();
    });

  const {
    open: openBottomSheet,
    close: closeBottomSheet,
    isOpen: isBottomSheetOpen,
  } = useVisibilityState();
  const {
    open: openAlertModal,
    close: closeAlertModal,
    isOpen: isAlertModalOpen,
  } = useVisibilityState();

  const [userSelected, setUserSelected] = useState<User | null>(null);
  const [optionSelected, setOptionSelected] = useState<MemberOptions>(
    MemberOptions.ACCEPT,
  );

  function handleGoingBack(): void {
    if (history.length > 2) {
      history.back();
      return;
    }

    navigate('/tabs/search');
  }

  function handleSelectUser(user: User): void {
    setUserSelected(user);
    openBottomSheet();
  }

  function handleJoinResquest(accepted: boolean): void {
    if (userSelected) {
      mutate({ userId: userSelected.id, accepted });
      closeAlertModal();
      closeBottomSheet();
    }
  }

  function handleMemberOption(option: MemberOptions): void {
    if (option === MemberOptions.ACCEPT) {
      handleJoinResquest(true);
      return;
    }

    if (option === MemberOptions.REJECT) {
      handleJoinResquest(false);
      return;
    }

    if (option === MemberOptions.EXCLUDE) {
      if (userSelected) {
        removeMember({ userId: userSelected.id });
        closeAlertModal();
        closeBottomSheet();
      }
    }
  }

  function handleSelectMemberOption(option: MemberOptions): void {
    setOptionSelected(option);
    openAlertModal();
  }

  function resetCurrentFleetJoinRequestQuery(): void {
    queryClient.resetQueries({
      queryKey: [
        `${FLEET_REQUESTS_LIST_API_PATH.replace('{fleetId}', fleet.id)}`,
      ],
    });
  }

  async function handleOnRefreshPull(): Promise<void> {
    resetCurrentFleetJoinRequestQuery();
    invalidateCurrentFleetQuery();

    return new Promise((resolve) => setTimeout(resolve, 2000));
  }

  const pendingRequests = joinRequests.filter(
    (request: JoinRequest) => request.status === JoinRequestStatus.PENDING,
  );

  return (
    <IonPage className="bg-primary text-dark">
      <div className="flex h-screen flex-col overflow-y-auto pt-[max(35px,var(--ion-safe-area-top))]">
        <IonHeader>
          <Header title={fleet.name} onClickIconLeft={handleGoingBack} />
        </IonHeader>
        <IonContent
          className="part-[scroll]:overflow-visible part-[background]:bg-transparent part-[scroll]:pt-0"
          scrollY={false}
        >
          <RefreshOnPull onRefresh={handleOnRefreshPull} color={colors.light} />
          <div className="flex min-h-full flex-1 flex-col gap-6 rounded-t-[20px] bg-light p-6">
            <h3 className="text-2xl font-bold">Les membres </h3>
            {isFetching || isLoadingRemoveMemberMutation ? (
              <Skeleton className="h-[70px]" />
            ) : (
              fleet?.members?.map((member) => (
                <MemberSettings
                  user={member}
                  onClick={handleSelectUser}
                  disabled={member.id === user.id}
                  key={member.id}
                />
              ))
            )}

            {isCurrentUserAdmin && (
              <Fragment>
                <h3 className="text-2xl font-bold">En attente </h3>
                {isLoadingJoinRequestList || isLoadingJoinRequestMutation ? (
                  <Skeleton className="h-[70px]" />
                ) : pendingRequests?.length > 0 ? (
                  pendingRequests?.map((request) => (
                    <MemberSettings
                      user={request.user!}
                      onClick={handleSelectUser}
                      disabled={request.userId === user.id}
                      key={request.userId}
                    />
                  ))
                ) : (
                  <p>Pas de demande en attente</p>
                )}
              </Fragment>
            )}
          </div>

          {/* TODO -> Peut-être changer le design pour qu'on ai les infos du user en haut et pas son nom à chaque item (à voir) */}
          <BottomSheet.Root
            isOpen={isBottomSheetOpen}
            onWillDismiss={closeBottomSheet}
          >
            {userSelected && (
              <BottomSheet.Button>
                <FaExclamationTriangle className="size-5" />
                <p>Signaler {getUserDisplayName(userSelected)}</p>
              </BottomSheet.Button>
            )}
            {isCurrentUserAdmin &&
              userSelected &&
              userSelected.fleetId !== fleet.id && (
                <Fragment>
                  <BottomSheet.Button
                    onClick={() =>
                      handleSelectMemberOption(MemberOptions.ACCEPT)
                    }
                  >
                    <IoMdAddCircle className="size-5" />
                    <p>Accepter {getUserDisplayName(userSelected)}</p>
                  </BottomSheet.Button>
                  <BottomSheet.Button
                    onClick={() =>
                      handleSelectMemberOption(MemberOptions.REJECT)
                    }
                  >
                    <IoMdRemoveCircle className="size-5" />
                    <p>Refuser {getUserDisplayName(userSelected)}</p>
                  </BottomSheet.Button>
                </Fragment>
              )}
            {isCurrentUserAdmin &&
              userSelected?.fleetId === fleet.id &&
              fleet.status === FleetStatus.FORMATION && (
                <BottomSheet.Button
                  onClick={() =>
                    handleSelectMemberOption(MemberOptions.EXCLUDE)
                  }
                >
                  <IoMdRemoveCircle className="size-5" />
                  <p>Exclure {getUserDisplayName(userSelected)} du Fleet</p>
                </BottomSheet.Button>
              )}
          </BottomSheet.Root>
          <AlertModal
            isOpen={isAlertModalOpen}
            onClose={closeAlertModal}
            onConfirm={() => handleMemberOption(optionSelected)}
            title="Membres du fleet"
            buttonConfirmLabel={optionSelected}
            description={
              userSelected
                ? MemberOptionsLabel[optionSelected](
                    getUserDisplayName(userSelected),
                  )
                : ''
            }
          />
        </IonContent>
      </div>
    </IonPage>
  );
};

export default Members;
