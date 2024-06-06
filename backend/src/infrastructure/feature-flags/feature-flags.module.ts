import { Module } from '@nestjs/common';
import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/config.service';
import { FeatureFlagsService } from './feature-flags.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: FeatureFlagsService,
      useFactory: async (configService: ConfigService) => {
        const service = new FeatureFlagsService(configService);
        await service.initialize();
        return service;
      },
      inject: [ConfigService],
    },
  ],
  exports: [FeatureFlagsService],
})
export class FeatureFlagsModule {}
