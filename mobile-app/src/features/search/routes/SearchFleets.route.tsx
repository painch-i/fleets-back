import { useCurrentUser } from '@/features/auth/providers/current-user.provider';
import { SearchTripCard } from '@/features/search/components/SearchTrip.card';
import { getUserDisplayName } from '@/utils/user';

// TODO Mettre un motif simple et fin pour le back car ça fait trop vide
import { IonContent, IonPage } from '@ionic/react';

export const SearchFleets: React.FC = () => {
  const { user } = useCurrentUser();
  console.log({ user });
  const displayName = getUserDisplayName(user);

  return (
    <IonPage>
      <IonContent className="part-[background]:bg-primary">
        <div className="relative size-full bg-light px-5 before:absolute before:-top-0.5 before:left-0 before:h-[38%] before:w-full before:rounded-b-[30px] before:bg-primary before:shadow-xl before:content-['']">
          <h3 className="relative text-2xl text-light"> Bonjour </h3>
          <h1 className="relative mb-1 mt-0.5 text-3xl font-bold text-light">
            {displayName} !
          </h1>
          <h5 className="relative mb-[8%] text-xl text-light">
            Où allez-vous aujourd'hui ?
          </h5>
          <SearchTripCard />
        </div>
      </IonContent>
    </IonPage>
  );
};
