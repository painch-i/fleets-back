/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { useIonRouter } from '@ionic/react';
import { FaChevronLeft } from 'react-icons/fa';

import { colors } from '@/styles';

// TODO -> Global header component

const styles = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 25,
  '& > h3': {
    color: colors.light,
    fontWeight: 'bold',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    margin: '0 auto',
  },
});

const ChatHeader = () => {
  const router = useIonRouter();

  function handleGoingBack(): void {
    if (router.canGoBack()) {
      router.goBack();
      return;
    }
    router.push('/tabs/search');
  }

  return (
    <header css={styles}>
      <FaChevronLeft size={20} color="white" onClick={handleGoingBack} />
      <h3>Messagerie</h3>
    </header>
  );
};

export default ChatHeader;
