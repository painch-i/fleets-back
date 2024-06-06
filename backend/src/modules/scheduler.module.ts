import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { EventBridgeTaskScheduler } from '../infrastructure/scheduler/event-bridge-task-scheduler.service';
import { SchedulerController } from '../presenter/http/scheduler.controller';
import { FleetsModule } from './fleets.module';

@Module({
  imports: [ConfigModule, FleetsModule],
  controllers: [SchedulerController],
  providers: [EventBridgeTaskScheduler],
  exports: [EventBridgeTaskScheduler],
})
export class SchedulerModule {}
