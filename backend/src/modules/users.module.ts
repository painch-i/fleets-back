import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { MailsManager } from '../domain/mailing/mails.manager';
import { UsersManager } from '../domain/users/users.manager';
import { EventStore } from '../infrastructure/events/event-store.service';
import { FeatureFlagsModule } from '../infrastructure/feature-flags/feature-flags.module';
import { FirebaseService } from '../infrastructure/firebase.service';
import { ResendService } from '../infrastructure/mailing/resend.service';
import { SendgridService } from '../infrastructure/mailing/sendgrid.service';
import { PrismaService } from '../infrastructure/persistence/read-database/prisma/prisma.service';
import { UsersRepository } from '../infrastructure/repositories/users.repository';
import { EtnaApi } from '../infrastructure/schools/etna.api';
import { VerificationService } from '../infrastructure/verification/verification.service';
import { UsersController } from '../presenter/http/users.controller';
import { AuthModule } from './auth.module';
@Module({
  imports: [AuthModule, ConfigModule, FeatureFlagsModule],
  controllers: [UsersController],
  providers: [
    EventStore,
    PrismaService,
    UsersRepository,
    UsersManager,
    VerificationService,
    MailsManager,
    SendgridService,
    ResendService,
    EtnaApi,
    FirebaseService,
  ],
})
export class UsersModule {}
