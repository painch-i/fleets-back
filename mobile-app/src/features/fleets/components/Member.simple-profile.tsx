/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';

import MemberAvatar from '@/features/fleets/components/Member.avatar';
import { User } from '@/features/auth/types/user.types';
import { colors } from '@/styles';
import { getUserDisplayName } from '@/utils/user';

const styles = css({
  width: 60,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
  '& > .member-avatar': {
    width: '100%',
  },
  '& > p': {
    fontSize: 15,
    fontWeight: 600,
    color: colors.dark,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
});

interface MemberSimpleProfileProps {
  member: User;
}

const MemberSimpleProfile = ({ member }: MemberSimpleProfileProps) => {
  const { gender, email } = member;

  return (
    <div css={styles}>
      <MemberAvatar userGender={gender} />
      <p>{getUserDisplayName(email)}</p>
    </div>
  );
};

export default MemberSimpleProfile;
