import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class MailsManager {
  constructor(private readonly configService: ConfigService) {}
  async sendOTPEmail(email: string, otp: string) {
    const environment = this.configService.get('FLEETS_ENV');
    if (environment === 'production') {
      // send email
    } else {
      console.log(`OTP for ${email}: ${otp}`);
    }
  }
}
