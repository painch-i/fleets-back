import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { z } from 'zod';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { RequiredEnv } from '../config/required-env.decorator';
import { AuthService } from '../infrastructure/authentication/auth.service';
import { FeatureFlagsModule } from '../infrastructure/feature-flags/feature-flags.module';
import { PrismaService } from '../infrastructure/persistence/read-database/prisma/prisma.service';
import { UsersRepository } from '../infrastructure/repositories/users.repository';

@RequiredEnv({
  key: 'JWT_SECRET',
  schema: z.string(),
})
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        secretOrPrivateKey: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '30d',
        },
      }),
      inject: [ConfigService],
    }),
    FeatureFlagsModule,
  ],
  controllers: [],
  providers: [AuthService, UsersRepository, PrismaService, JwtService],
  exports: [AuthService, JwtService],
})
export class AuthModule {}
