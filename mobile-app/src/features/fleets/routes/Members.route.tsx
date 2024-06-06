/** @jsxImportSource @emotion/react */
import React, { Fragment, useState } from 'react';

import { css } from '@emotion/react';
import { useQueryClient } from '@tanstack/react-query';
import { IonContent, IonHeader, IonPage, useIonRouter } from '@ionic/react';
import { FaChevronLeft, FaExclamationTriangle } from 'react-icons/fa';
import { IoMdAddCircle, IoMdRemoveCircle } from 'react-icons/io';

import {
  FLEET_REQUESTS_LIST_API_PATH,
  useFleetJoinRequestListQuery,
} from '@/features/fleets/api/join-requests.query';
import { useRemoveMemberFleetMutation } from '@/features/fleets/api/remove-member-fleet.mutation';
import { useRespondToRequestMutation } from '@/features/fleets/api/respond-to-request.mutation';
import { useCurrentUser } from '@/features/auth/providers/current-user.provider';
import { useCurrentFleet } from '@/features/fleets/providers/current-fleet.provider';
import useVisibilityState from '@/hooks/use-visibility-state.hook';

import AlertModal from '@/components/AlertModal/Alert.modal';
import BottomSheet from '@/components/BottomSheet/Bottom.sheet';
import Skeleton from '@/components/Skeleton/Skeleton.text';
import MemberSettings from '@/features/fleets/components/Member.settings';
import RefreshOnPull from '@/components/RefreshOnPull/RefreshOnPull.component';

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
import { getUserDisplayName } from '@/utils/user';

const styles = css({
  background: colors.primary,
  color: colors.dark,
  '.scrollable-container': {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflowY: 'auto',
    paddingTop: 'max(35px, var(--ion-safe-area-top))',
  },
  'ion-content::part(background)': {
    background: 'transparent',
  },
  'ion-content::part(scroll)': {
    paddingTop: 0,
    overflow: 'visible',
  },
  'ion-header': {
    wifth: '100%',
    display: 'flex',
    flexDirection: 'row',
    padding: 25,
    gap: 25,
    alignItems: 'center',
    justifyContent: 'space-between',
    '& > h3': {
      flex: 1,
      textAlign: 'center',
      paddingRight: 45,
      color: colors.light,
      fontWeight: 'bold',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    },
  },
  '.content': {
    flex: 1,
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
    padding: 25,
    gap: 25,
    backgroundColor: colors.light,
    '& > h3': {
      fontSize: 23,
      color: colors.dark,
      fontWeight: 'bold',
    },
  },
});

export const Members: React.FC = () => {
  const router = useIonRouter();
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
    if (router.canGoBack()) {
      router.goBack();
      return;
    }

    router.push('/tabs/search');
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
    <IonPage css={styles}>
      <div className="scrollable-container">
        <IonHeader>
          <FaChevronLeft size={20} color="white" onClick={handleGoingBack} />
          <h3>{fleet?.name}</h3>
        </IonHeader>
        <IonContent scrollY={false}>
          <RefreshOnPull onRefresh={handleOnRefreshPull} color={colors.light} />
          <div className="content">
            <h3>Les membres </h3>
            {isFetching || isLoadingRemoveMemberMutation ? (
              <Skeleton h={70} />
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
                <h3>En attente </h3>
                {isLoadingJoinRequestList || isLoadingJoinRequestMutation ? (
                  <Skeleton h={70} />
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
          <BottomSheet
            isOpen={isBottomSheetOpen}
            onWillDismiss={closeBottomSheet}
          >
            {/* TODO -> Ajouter des icons pour chaque type */}
            <div className="bottom-sheet-btn" tabIndex={0}>
              <FaExclamationTriangle size={20} color={colors.dark} />
              <p>Signaler {getUserDisplayName(userSelected?.email || '')}</p>
            </div>
            {isCurrentUserAdmin && userSelected?.fleetId !== fleet.id && (
              <Fragment>
                <div
                  className="bottom-sheet-btn"
                  onClick={() => handleSelectMemberOption(MemberOptions.ACCEPT)}
                  tabIndex={0}
                >
                  <IoMdAddCircle size={20} color={colors.dark} />

                  <p>
                    Accepter {getUserDisplayName(userSelected?.email || '')}
                  </p>
                </div>
                <div
                  className="bottom-sheet-btn"
                  onClick={() => handleSelectMemberOption(MemberOptions.REJECT)}
                  tabIndex={0}
                >
                  <IoMdRemoveCircle size={20} color={colors.dark} />

                  <p>Refuser {getUserDisplayName(userSelected?.email || '')}</p>
                </div>
              </Fragment>
            )}
            {isCurrentUserAdmin &&
              userSelected?.fleetId === fleet.id &&
              fleet.status === FleetStatus.FORMATION && (
                <div
                  className="bottom-sheet-btn"
                  onClick={() =>
                    handleSelectMemberOption(MemberOptions.EXCLUDE)
                  }
                  tabIndex={0}
                >
                  <IoMdRemoveCircle size={20} color={colors.dark} />
                  <p>
                    Exclure {getUserDisplayName(userSelected?.email || '')} du
                    Fleet
                  </p>
                </div>
              )}
          </BottomSheet>
          <AlertModal
            isOpen={isAlertModalOpen}
            onClose={closeAlertModal}
            onConfirm={() => handleMemberOption(optionSelected)}
            title="Membres du fleet"
            buttonConfirmLabel={optionSelected}
            description={MemberOptionsLabel[optionSelected](
              getUserDisplayName(userSelected?.email || ''),
            )}
          />
        </IonContent>
      </div>
    </IonPage>
  );
};

export default Members;
