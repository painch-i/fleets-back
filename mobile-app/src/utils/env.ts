export const isEnvFlagTrue = (key: string): boolean => {
  if (!process.env.VITE_MODE || process.env.VITE_MODE === 'testing') {
    return key === 'VITE_LOCAL_SERVER';
  }

  return import.meta.env[key] === 'true';
};
