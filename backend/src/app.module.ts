import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { FeatureFlagsModule } from './infrastructure/feature-flags/feature-flags.module';
import { ChatModule } from './modules/chat.module';
import { FleetsModule } from './modules/fleets.module';
import { NavigationModule } from './modules/navigation.module';
import { StaticModule } from './modules/static.module';
import { UsersModule } from './modules/users.module';

@Module({
  imports: [
    UsersModule,
    StaticModule,
    FleetsModule,
    NavigationModule,
    ChatModule,
    ConfigModule,
    FeatureFlagsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
