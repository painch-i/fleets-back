import { Injectable } from '@nestjs/common';
import { startUnleash, Unleash } from 'unleash-client';
import {
  developmentFlags,
  UNLEASH_APP_NAMES,
} from '../../config/config-variables';
import {
  ConfigService,
  FleetsEnvironmentEnum,
} from '../../config/config.service';
import { IFeatureFlagsService } from '../../domain/_shared/feature-flags-service.interface';

@Injectable()
export class FeatureFlagsService implements IFeatureFlagsService {
  private unleash: Unleash;
  private useDevelopmentFlags = false;
  constructor(private readonly configService: ConfigService) {}
  async initialize(): Promise<void> {
    const fleetsEnv = this.configService.get('FLEETS_ENV');
    if (fleetsEnv === FleetsEnvironmentEnum.DEVELOPMENT) {
      this.useDevelopmentFlags = true;
    } else {
      this.unleash = await startUnleash({
        url: 'https://gitlab.com/api/v4/feature_flags/unleash/42893609',
        appName: UNLEASH_APP_NAMES[fleetsEnv],
        instanceId: 'glffct-ndo3XYzunm2Q61ARWSi_',
      });
    }
  }
  isEnabled(featureName: string): boolean {
    if (this.useDevelopmentFlags) {
      return developmentFlags[featureName] ?? false;
    }
    return this.unleash.isEnabled(featureName);
  }
}
