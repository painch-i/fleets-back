import { HTMLAttributes } from 'react';

import { Gender, UserGenderPathAsset } from '@/features/auth/types/user.types';
import { cn } from '@/utils/lib';

type MemberAvatarProps = HTMLAttributes<HTMLDivElement> & {
  userGender: Gender;
};

const MemberAvatar = ({
  userGender,
  className,
  ...props
}: MemberAvatarProps) => (
  <div
    className={cn(
      'flex aspect-square flex-1 items-end justify-center overflow-hidden rounded-[50%] border border-solid border-label bg-label',
      className,
    )}
    {...props}
  >
    <img className="h-[88%]" src={UserGenderPathAsset[userGender]} />
  </div>
);

export default MemberAvatar;
