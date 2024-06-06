/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';

import { TransportMode } from '@/features/search/types/transport.types';
import { Line } from '@/features/search/types/line.types';

const styles = css({
  height: 0,
  minWidth: '60px',
  paddingBottom: 'var(--size)',
  position: 'relative',
  display: 'flex',
  borderRadius: '21.5%',
  backgroundColor: 'var(--background)',
  '> div': {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    p: {
      fontSize: '3.5vh',
      fontWeight: 'bolder',
      color: 'var(--text)',
    },
  },
});

const tramStyles = css({
  borderRadius: 0,
  backgroundColor: 'transparent',
  '> div': {
    justifyContent: 'space-between',
    span: {
      height: '15%',
      width: '100%',
      backgroundColor: 'var(--background)',
      borderRadius: '3px',
    },
  },
});

const metroStyles = css({
  borderRadius: '50%',
});

interface TransportIconOptions {
  line: Line;
  action?: () => void;
  size?: string;
}

export const TransportIcon: React.FC<TransportIconOptions> = ({
  line,
  action,
  size = '100%',
}) => {
  const isTram = line.mode === TransportMode.TRAM;
  const isMetro = line.mode === TransportMode.METRO;

  return (
    <div
      onClick={action}
      style={{
        ['--size' as string]: size,
        ['--background' as string]: `#${line.color}`,
        ['--text' as string]: `#${isTram ? '000000' : line.textColor}`,
      }}
      css={css([styles, isMetro && metroStyles, isTram && tramStyles])}
      data-cy="transport-icon"
    >
      <div className="container">
        {isTram && <span />}
        <p>{line.name}</p>
        {isTram && <span />}
      </div>
    </div>
  );
};
