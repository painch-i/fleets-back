/**
 * Module qui définit le service d'authentification Firebase.
 * @module AuthService
 */

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OneTimePassword } from '@prisma/client';
import { getRandomValues } from 'node:crypto';
import { z } from 'zod';
import {
  OTP_CODE_LENGTH,
  OTP_EXPIRATION_MINUTES,
} from '../../config/config-variables';
import { ConfigService } from '../../config/config.service';
import { RequiredEnv } from '../../config/required-env.decorator';
import {
  AuthTokenPayload,
  IAuthService,
} from '../../domain/_shared/auth-service.interface';
import { FeatureFlagsService } from '../feature-flags/feature-flags.service';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
@RequiredEnv({
  key: 'JWT_SECRET',
  schema: z.string(),
})
export class AuthService implements IAuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly featureFlagsService: FeatureFlagsService,
  ) {}

  async createOTP(email: string): Promise<string> {
    const otp = Array.from({ length: OTP_CODE_LENGTH }, () =>
      Math.floor(
        (getRandomValues(new Uint32Array(1))[0] / (0x100000000 - 1)) * 10,
      ),
    ).join('');
    const expiry = Date.now() + OTP_EXPIRATION_MINUTES * 60 * 1000;
    await this.usersRepository.setOTP(email, otp, new Date(expiry));
    return otp;
  }

  async verifyOTP(email: string, otp: string): Promise<boolean> {
    const bypassOtp = this.featureFlagsService.isEnabled(
      'bypass-otp-verification',
    );
    if (bypassOtp) {
      return true;
    }
    let validOtp: OneTimePassword;
    try {
      validOtp = await this.usersRepository.getOTP(email);
    } catch (error) {
      return false;
    }
    const { code, expiresAt } = validOtp;
    if (code !== otp) {
      return false;
    }
    if (expiresAt < new Date()) {
      return false;
    }
    return true;
  }

  async verifyToken(token: string): Promise<AuthTokenPayload> {
    const payload = this.jwtService.verify<AuthTokenPayload>(token, {
      secret: this.configService.get('JWT_SECRET'),
    });
    return payload;
  }

  async createToken(options: AuthTokenPayload): Promise<string> {
    return this.jwtService.sign(options, {
      secret: this.configService.get('JWT_SECRET'),
    });
  }
}

export function decodeToken(token: string): AuthTokenPayload {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}
