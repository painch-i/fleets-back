/** @jsxImportSource @emotion/react */

import { SerializedStyles, css } from '@emotion/react';

const styles = css({
  position: 'relative',
  width: '20px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',

  '.point': {
    width: '15px',
    height: '15px',
    backgroundColor: 'black',
    borderRadius: '50%',
  },
  '.empty': {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    border: '1px solid black',
  },
  '.line': {
    flex: 1,
    width: '3px',
    backgroundColor: 'black',
  },
});

interface StationsLineOptions {
  customStyle?: SerializedStyles;
}

export const StationsLine: React.FC<StationsLineOptions> = ({
  customStyle,
}: StationsLineOptions) => (
  <div css={[styles, customStyle && customStyle]}>
    <div className="point" />
    <div className="line" />
    <div className="empty" />
  </div>
);
