import {
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
} from '@ionic/react';

import { colors } from '@/styles';

interface RefreshOnPullProps {
  /**
   * Function to call when the pull-to-refresh is triggered.
   */
  onRefresh: () => Promise<void>;
  /**
   * Color of the spinner.
   * @default dark
   */
  color?: string;
}

// TODO -> Ne fonctionne pas sur IOS (Try to update package)

/**
 * Renders a PullToRefresh component  component that triggers a refresh action when the user performs a pull-to-refresh gesture.
 *
 * @param {ProgressPointProps} {@link RefreshOnPullProps} - Props for the PullToRefresh component.
 *
 * @returns {JSX.Element} JSX.Element.
 *
 * @description A component that triggers a refresh action when the user performs a pull-to-refresh gesture.
 *
 * @example
 * <RefreshOnPull onRefresh={refreshQuery} />
 */
const RefreshOnPull = ({
  onRefresh,
  color = colors.dark,
}: RefreshOnPullProps): JSX.Element => {
  async function handleRefresh(
    event: CustomEvent<RefresherEventDetail>,
  ): Promise<void> {
    await onRefresh();
    event.detail.complete();
  }

  return (
    <IonRefresher
      slot="fixed"
      mode="ios"
      style={{ '--color': color }}
      pullMin={100}
      onIonRefresh={handleRefresh}
      data-cy="refresh-on-pull"
    >
      <IonRefresherContent />
    </IonRefresher>
  );
};

export default RefreshOnPull;
