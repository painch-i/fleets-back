import { UnleashAppName } from '../infrastructure/feature-flags/feature-flags.types';
import { FleetsEnvironmentEnum } from './config.service';

export const MAX_STRING_LENGTH = 255;
export const MAX_FLEET_MEMBERS = 4;
export const OTP_CODE_LENGTH = 6;
export const OTP_EXPIRATION_MINUTES = 10;
export const MIN_USER_AGE = 18;
export const developmentFlags = {
  'bypass-otp-verification': true,
  'use-short-delays': false,
} as const;

export const UNLEASH_APP_NAMES: Record<FleetsEnvironmentEnum, UnleashAppName> =
  {
    [FleetsEnvironmentEnum.PRODUCTION]: 'Production',
    [FleetsEnvironmentEnum.PREPROD]: 'Pre-production',
    [FleetsEnvironmentEnum.DEVELOPMENT]: 'Development',
  };
