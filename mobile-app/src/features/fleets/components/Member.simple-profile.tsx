import { User } from '@/features/auth/types/user.types';
import MemberAvatar from '@/features/fleets/components/Member.avatar';
import { getUserDisplayName } from '@/utils/user';

interface MemberSimpleProfileProps {
  member: User;
}

const MemberSimpleProfile = ({ member }: MemberSimpleProfileProps) => {
  const { gender } = member;

  return (
    <div className="flex w-[60px] flex-col items-center justify-between gap-2.5">
      <MemberAvatar className="w-full" userGender={gender} />
      <p className="truncate text-sm font-semibold text-dark">
        {getUserDisplayName(member)}
      </p>
    </div>
  );
};

export default MemberSimpleProfile;
