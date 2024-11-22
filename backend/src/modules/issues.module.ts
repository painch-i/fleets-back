import { Module } from '@nestjs/common';
import { IssuesManager } from '../domain/issues/issues.manager';
import { IssuesService } from '../infrastructure/repositories/issues.service';
import { IssuesController } from '../presenter/http/issues.controller';
import { AuthModule } from './auth.module';
import { DatabaseModule } from './database.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [IssuesController],
  providers: [IssuesManager, IssuesService],
  exports: [IssuesManager],
})
export class IssuesModule {}
