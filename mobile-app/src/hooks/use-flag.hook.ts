import { useMemo } from 'react';

import { isEnvFlagTrue } from '@/utils/env';

const useFlag = (flag: string) => {
  const isEnabled = useMemo(() => {
    return isEnvFlagTrue(`VITE_${flag}`);
  }, [flag]);

  return isEnabled;
};

export default useFlag;
