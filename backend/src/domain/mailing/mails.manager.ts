import { Inject, Injectable } from '@nestjs/common';
import boxen, { Options } from 'boxen';
import chalk from 'chalk';
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
      const formattedOtp = formatOtp(email, otp);
      console.log(formattedOtp);
    } else {
      // Send email
      console.warn('No email implementation yet');
    }
  }
}

function formatOtp(email: string, otp: string) {
  const otpMessage = `
  ${chalk.blue.bold('🔐 OTP Information')}
  ${chalk.blue('Email:')} ${chalk.white.bold(email)}
  ${chalk.blue('OTP:')} ${chalk.green.bold(otp)}
  `;

  const boxenOptions: Options = {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'blue',
    backgroundColor: '#555555',
  };

  const formattedMessage = boxen(otpMessage, boxenOptions);
  return formattedMessage;
}
