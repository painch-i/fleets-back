export type SendOTPMailOptions = {
  to: string;
  otp: string;
};

export interface IMailsService {
  sendOTP(options: SendOTPMailOptions): Promise<void>;
}
