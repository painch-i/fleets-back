/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { IonContent, IonPage } from '@ionic/react';

import { useCurrentUserQuery } from '@/features/auth/api/use-current-user.query';
import { SearchTripCard } from '@/features/search/components/SearchTrip.card';
import { colors } from '@/styles';
import { getUserDisplayName } from '@/utils/user';

// TODO Mettre un motif simple et fin pour le back car ça fait trop vide
const styles = css({
  '::part(background)': {
    backgroundColor: colors.primary,
  },
  '> .container': {
    width: '100%',
    height: '100%',
    padding: '0 20px',
    position: 'relative',
    backgroundColor: colors.light,
  },
  '> .container::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '45%',
    backgroundColor: colors.primary,
    borderBottomLeftRadius: '30px',
    borderBottomRightRadius: '30px',
    boxShadow: '0 20px 20px -5px rgba(0, 0, 0, 0.25)',
  },
  'h1, h3, h5': {
    color: colors.light,
    position: 'relative',
  },
  h1: {
    fontSize: '35px',
    fontWeight: 'bold',
    margin: '2px 0 5px',
  },
  h5: {
    marginBottom: '8%',
  },
});

export const SearchFleets: React.FC = () => {
  const { data: user } = useCurrentUserQuery();

  const displayName = getUserDisplayName(user!.email);

  return (
    <IonPage>
      <IonContent css={styles}>
        <div className="container">
          <h3> Bonjour </h3>
          <h1> {displayName} ! </h1>
          <h5> Où allez-vous aujourd'hui ? </h5>
          <SearchTripCard />
        </div>
      </IonContent>
    </IonPage>
  );
};
