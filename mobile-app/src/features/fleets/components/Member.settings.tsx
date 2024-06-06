/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { TbDots } from 'react-icons/tb';

import { User } from '@/features/auth/types/user.types';
import MemberAvatar from '@/features/fleets/components/Member.avatar';
import { colors } from '@/styles';
import { getUserDisplayName } from '@/utils/user';

const styles = css({
  width: '100%',
  height: 45,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  position: 'relative',
  gap: 20,
  '& > .member-avatar': {
    maxHeight: 45,
    maxWidth: 45,
  },
  '& > p': {
    flex: 5,
    fontWeight: 'bold',
    color: colors.dark,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  '& > svg': {
    transform: 'rotate(90deg)',
  },
});

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
  const { gender, email } = user;

  return (
    <div css={styles}>
      <MemberAvatar userGender={gender} />
      <p>{getUserDisplayName(email)}</p>
      {!disabled && (
        <TbDots size={25} color={colors.label} onClick={() => onClick(user)} />
      )}
    </div>
  );
};

export default MemberSettings;
