import { css, SerializedStyles } from '@emotion/react';

import { colors } from '@/styles';

export const authLayoutStyles: SerializedStyles = css({
  '::part(background)': {
    backgroundColor: colors.primary,
  },
  '.content': {
    height: '100%',
    width: '100%',
    backgroundColor: colors.light,
  },
  '.background': {
    position: 'relative',
    width: '100%',
    height: '35%',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    padding: '0 10% 40%',
    backgroundColor: colors.primary,
    '& > .background-triangle': {
      width: 0,
      height: 0,
      position: 'absolute',
      bottom: -149,
      left: '50%',
      transform: 'translateX(-50%)',
      borderTop: `150px solid ${colors.primary}`,
      borderLeft: '50vw solid transparent',
      borderRight: '50vw solid transparent',
    },
    '& > img': {
      width: 50,
    },
    '& > h1': {
      color: colors.light,
      fontWeight: 'bolder',
      fontSize: 40,
    },
  },
  '.container': {
    position: 'absolute',
    width: '88%',
    top: '23%',
    left: '50%',
    height: 'auto',
    minHeight: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    gap: 35,
    justifyContent: 'space-between',
    padding: 25,
    backgroundColor: colors.light,
    borderRadius: 20,
    boxShadow: '5px 5px 40px 15px rgba(0,0,0,0.25)',
    '& > .inputs-container': {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 30,
    },
    '& > h1': {
      color: colors.label,
      fontWeight: 'bolder',
      fontSize: 35,
    },
  },
  '.submit-container': {
    display: 'flex',
    flexDirection: 'column',
    gap: 25,
    '& > p': {
      textAlign: 'center',
      color: colors.label,
      fontSize: 12,
      '& > span': {
        fontWeight: 'bold',
      },
    },
  },
});
