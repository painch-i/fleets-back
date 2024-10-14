import { FaVenusMars } from 'react-icons/fa';

import Toggle from '@/components/Toggle/Toggle.global';
import { useCurrentUser } from '@/features/auth/providers/current-user.provider';
import { UserGenderIcons } from '@/features/auth/types/user.types';
import { GenderConstraint } from '@/features/fleets/types/fleet.types';
import { useTripSelectionStore } from '@/features/search/stores/trip-selection.store';

const GenderToggle: React.FC = () => {
  const { user } = useCurrentUser();

  const [genderConstraint, updateFleet] = useTripSelectionStore((state) => [
    state.genderConstraint,
    state.updateFleet,
  ]);

  function handleToggleGenderConstraint(
    genderConstraint: GenderConstraint,
  ): void {
    updateFleet({ genderConstraint });
  }

  const UserGenderIcon = UserGenderIcons[user.gender || 'MALE'];
  const userGenderConstraint =
    user.gender === 'MALE'
      ? GenderConstraint.MALE_ONLY
      : GenderConstraint.FEMALE_ONLY;

  return (
    <Toggle
      value={genderConstraint}
      onChange={handleToggleGenderConstraint}
      defaultValues={[
        { value: GenderConstraint.NO_CONSTRAINT, icon: FaVenusMars },
        {
          value: userGenderConstraint,
          icon: UserGenderIcon,
        },
      ]}
    />
  );
};

export default GenderToggle;
