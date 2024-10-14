import { TbDots } from 'react-icons/tb';

import { User } from '@/features/auth/types/user.types';
import MemberAvatar from '@/features/fleets/components/Member.avatar';
import { getUserDisplayName } from '@/utils/user';

interface MemberRoundProps {
  user: User;
  onClick: (user: User) => void;
  disabled?: boolean;
}

const MemberSettings = ({
  user,
  onClick,
  disabled = false,
}: MemberRoundProps) => {
  const { gender } = user;

  return (
    <div className="relative flex h-11 w-full items-center justify-between gap-5">
      <MemberAvatar userGender={gender} className="max-h-12 max-w-12" />
      <p className="flex-[5] truncate font-bold text-dark">
        {getUserDisplayName(user)}
      </p>
      {!disabled && (
        <TbDots
          className="size-6 rotate-90 text-label"
          onClick={() => onClick(user)}
        />
      )}
    </div>
  );
};

export default MemberSettings;
