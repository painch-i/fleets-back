import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { NavigationManager } from '../domain/navigation/navigation.manager';
import { PrismaService } from '../infrastructure/persistence/read-database/prisma/prisma.service';
import { NavigationCsvRepository } from '../infrastructure/repositories/navigation-csv.repository';
import { NavigationRepository } from '../infrastructure/repositories/navigation.repository';
import { RoutesService } from '../infrastructure/routes/routes.service';
import { NavigationController } from '../presenter/http/navigation.controller';

@Module({
  imports: [ConfigModule],
  controllers: [NavigationController],
  providers: [
    NavigationManager,
    PrismaService,
    NavigationRepository,
    NavigationCsvRepository,
    RoutesService,
  ],
  exports: [NavigationManager, RoutesService],
})
export class NavigationModule {}
