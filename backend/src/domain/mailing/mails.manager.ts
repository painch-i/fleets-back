import { Inject, Injectable } from '@nestjs/common';
import { FeatureFlagsService } from '../../infrastructure/feature-flags/feature-flags.service';
import { ResendService } from '../../infrastructure/mailing/resend.service';
import { IFeatureFlagsService } from '../_shared/feature-flags-service.interface';
import { IMailsService } from '../_shared/mails-service.interface';

@Injectable()
export class MailsManager {
  constructor(
    @Inject(FeatureFlagsService)
    private readonly featureFlagsService: IFeatureFlagsService,
    @Inject(ResendService)
    private readonly mailsService: IMailsService,
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
      console.log(
        `\x1b[32m%s\x1b[0m`,
        `📧 Sending OTP to \x1b[34m${email}\x1b[0m`,
      );
      await this.mailsService.sendOTP({ to: email, otp });
    }
  }
}
