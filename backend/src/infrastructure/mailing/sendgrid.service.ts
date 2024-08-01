import { Injectable } from '@nestjs/common';
import { render } from '@react-email/render';
import sengrid from '@sendgrid/mail';
import VerifyOtpEmail from 'transactional/dist/VerifyOTP.email';
import { z } from 'zod';
import { ConfigService } from '../../config/config.service';
import { RequiredEnv } from '../../config/required-env.decorator';
import {
  IMailsService,
  SendOTPMailOptions,
} from '../../domain/_shared/mails-service.interface';

@RequiredEnv({
  key: 'SENDGRID_API_KEY',
  schema: z.string(),
})
@Injectable()
export class SendgridService implements IMailsService {
  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    sengrid.setApiKey(apiKey);
  }
  async sendOTP(options: SendOTPMailOptions): Promise<void> {
    const html = render(VerifyOtpEmail(options.otp));
    const sengridOptions = {
      from: 'team@fleets-app.fr',
      to: options.to,
      subject: `Code de vérification Fleets`,
      html,
    };
    await sengrid.send(sengridOptions);
  }
}
