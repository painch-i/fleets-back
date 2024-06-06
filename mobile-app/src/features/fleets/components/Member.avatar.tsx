/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';

import { Gender, UserGenderPathAsset } from '@/features/auth/types/user.types';
import { colors } from '@/styles';

const styles = css({
  flex: 1,
  aspectRatio: '1/1',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'end',
  borderRadius: '50%',
  backgroundColor: colors.label,
  border: `1px solid ${colors.label}`,
  overflow: 'hidden',
  '& > img': {
    height: '88%',
  },
});

interface MemberAvatarProps {
  userGender: Gender;
}

const MemberAvatar = ({ userGender }: MemberAvatarProps) => (
  <div css={styles} className="member-avatar">
    <img src={UserGenderPathAsset[userGender]} />
  </div>
);

export default MemberAvatar;
