import { OTPPayload } from './auth-service.interface';

export type SendOTPMailOptions = {
  to: string;
  otp: OTPPayload;
};

export interface IMailsService {
  sendOTP(options: SendOTPMailOptions): Promise<void>;
}
