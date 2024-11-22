import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { NavigationManager } from '../domain/navigation/navigation.manager';
import { NavigationCsvRepository } from '../infrastructure/repositories/navigation-csv.repository';
import { NavigationRepository } from '../infrastructure/repositories/navigation.repository';
import { RoutesService } from '../infrastructure/routes/routes.service';
import { NavigationController } from '../presenter/http/navigation.controller';
import { DatabaseModule } from './database.module';

@Module({
  imports: [ConfigModule, DatabaseModule],
  controllers: [NavigationController],
  providers: [
    NavigationManager,
    NavigationRepository,
    NavigationCsvRepository,
    RoutesService,
  ],
  exports: [NavigationManager, RoutesService],
})
export class NavigationModule {}
