import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { FleetsManager } from '../domain/fleets/fleets.manager';
import { EventStore } from '../infrastructure/events/event-store.service';
import { FeatureFlagsModule } from '../infrastructure/feature-flags/feature-flags.module';
import { FirebaseService } from '../infrastructure/firebase.service';
import { FleetsRepository } from '../infrastructure/repositories/fleets.repository';
import { FleetsUnitOfWork } from '../infrastructure/repositories/fleets.unit-of-work';
import { UsersRepository } from '../infrastructure/repositories/users.repository';
import { LocalTaskSchedulerService } from '../infrastructure/scheduler/local-task-scheduler.service';
import { EventGateway } from '../presenter/event/event.gateway';
import {
  FleetsController,
  SingleFleetController,
} from '../presenter/http/fleets.controller';
import { AuthModule } from './auth.module';
import { DatabaseModule } from './database.module';
import { NavigationModule } from './navigation.module';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    FeatureFlagsModule,
    NavigationModule,
    DatabaseModule,
  ],
  controllers: [FleetsController, SingleFleetController],
  providers: [
    FleetsRepository,
    FleetsManager,
    UsersRepository,
    FleetsUnitOfWork,
    EventGateway,
    EventStore,
    FirebaseService,
    LocalTaskSchedulerService,
  ],
  exports: [FleetsManager],
})
export class FleetsModule {}
