import { Injectable } from '@nestjs/common';
import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
import VerifyOtpEmail from 'transactional/dist/VerifyOTP.email';
import { z } from 'zod';
import { ConfigService } from '../../config/config.service';
import { RequiredEnv } from '../../config/required-env.decorator';
import {
  IMailsService,
  SendOTPMailOptions,
} from '../../domain/_shared/mails-service.interface';

@RequiredEnv(
  {
    key: 'SMTP_HOST',
    schema: z.string(),
  },
  {
    key: 'SMTP_PORT',
    schema: z.number(),
  },
  {
    key: 'SMTP_USER',
    schema: z.string(),
  },
  {
    key: 'SMTP_PASS',
    schema: z.string(),
  },
)
@Injectable()
export class NodemailerService implements IMailsService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = this.configService.get<number>('SMTP_PORT');
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
    });
  }

  async sendOTP(options: SendOTPMailOptions): Promise<void> {
    const html = render(
      VerifyOtpEmail({
        otp: options.otp,
        email: options.to,
      }),
    );

    const mailOptions = {
      from: 'team@fleets-app.fr',
      to: options.to,
      subject: `Code de vérification Fleets`,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
