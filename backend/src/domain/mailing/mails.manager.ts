import { Inject, Injectable } from '@nestjs/common';
import { FeatureFlagsService } from '../../infrastructure/feature-flags/feature-flags.service';
import { IFeatureFlagsService } from '../_shared/feature-flags-service.interface';

@Injectable()
export class MailsManager {
  constructor(
    @Inject(FeatureFlagsService)
    private readonly featureFlagsService: IFeatureFlagsService,
  ) {}
  async sendOTPEmail(email: string, otp: string) {
    const sendOTPEmailEnabled =
      this.featureFlagsService.isEnabled('send-otp-emails');
    if (!sendOTPEmailEnabled) {
      console.log(
        `\x1b[32m%s\x1b[0m`,
        `✅ OTP for \x1b[34m${email}\x1b[0m: \x1b[33m${otp}\x1b[0m`,
      );
    } else {
      // Send email
      console.warn('No email implementation yet');
    }
  }
}
