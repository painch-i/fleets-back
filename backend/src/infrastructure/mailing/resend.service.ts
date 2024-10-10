import { Injectable } from '@nestjs/common';
import { render } from '@react-email/render';
import { Resend } from 'resend';
import VerifyOtpEmail from 'transactional/dist/VerifyOTP.email';
import { z } from 'zod';
import { ConfigService } from '../../config/config.service';
import { RequiredEnv } from '../../config/required-env.decorator';
import {
  IMailsService,
  SendOTPMailOptions,
} from '../../domain/_shared/mails-service.interface';

@RequiredEnv({
  key: 'RESEND_API_KEY',
  schema: z.string(),
})
@Injectable()
export class ResendService implements IMailsService {
  private resend: Resend;
  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.resend = new Resend(apiKey);
  }

  async sendOTP(options: SendOTPMailOptions): Promise<void> {
    const html = render(VerifyOtpEmail(options.otp));

    const resendOptions = {
      from: "L'Équipe Fleets <team@fleets-app.com>",
      to: options.to,
      subject: `🔐 Code de vérification`,
      html,
    };

    await this.resend.emails.send(resendOptions);
  }
}
