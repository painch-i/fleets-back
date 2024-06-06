/** @jsxImportSource @emotion/react */

import { colors } from '@/styles';
import { css } from '@emotion/react';
import { useIonRouter } from '@ionic/react';

import Button from '@/components/Button/Button.global';

import { useLines } from '@/features/search/api/use-lines.query';
import { useStationsByLine } from '@/features/search/api/use-stations-by-line.query';
import { useTripSelectionStore } from '@/features/search/stores/trip-selection.store';
import useVisibilityState from '@/hooks/use-visibility-state.hook';

import LinePicker from '@/features/search/components/Line.picker';
import SelectDateTimeModal from '@/features/search/components/modals/SelectDateTime.modal';
import { StationsModal } from '@/features/search/components/modals/Stations.modal';
import { TransportModeModal } from '@/features/search/components/modals/TransportMode.modal';
import StationsCard from '@/features/search/components/Stations.card';

const styles = css({
  width: '100%',
  padding: '16px',
  border: `1px solid ${colors.border}`,
  borderRadius: '13px',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  backgroundColor: 'white',
  boxShadow: '0 4px 10px 0px rgba(0, 0, 0, 0.25)',
});

const searchButtonStyle = css({
  borderRadius: '13px',
});

export const SearchTripCard: React.FC = () => {
  const router = useIonRouter();

  const { isOpen, open, close } = useVisibilityState(false);
  const {
    isOpen: isOpenStations,
    open: openStation,
    close: closeStation,
  } = useVisibilityState(false);

  const [isFilled, selectedLine] = useTripSelectionStore((state) => [
    state.isFilled,
    state.selectedLine,
  ]);

  const { data, isPending, isError } = useLines();
  const {
    data: stationsData = [],
    isPending: isLoadingStations,
    isError: isErrorStations,
  } = useStationsByLine(selectedLine?.id);

  const navigateToDestination = () => {
    router.push('/results-fleets');
  };

  return (
    <div css={styles}>
      <TransportModeModal
        linesByMode={data}
        isError={isError}
        isLoading={isPending}
        isOpen={isOpen}
        onClose={close}
      />
      <StationsModal
        data={stationsData}
        isLoading={isLoadingStations}
        isError={isErrorStations}
        isOpen={isOpenStations}
        onClose={closeStation}
      />
      <LinePicker openTransportModeModal={open} />
      <StationsCard openStationsModal={openStation} />
      <SelectDateTimeModal />
      <Button
        onClick={navigateToDestination}
        disabled={!isFilled()}
        customStyle={searchButtonStyle}
      >
        Rechercher
      </Button>
    </div>
  );
};
