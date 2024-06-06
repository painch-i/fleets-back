import { ApiProperty } from '@nestjs/swagger';
import { OTP_CODE_LENGTH } from '../../../../config/config-variables';

export class VerifyOTPHttpBody {
  @ApiProperty({ type: 'string', format: 'email' })
  email: string;

  @ApiProperty({
    type: 'string',
    minLength: OTP_CODE_LENGTH,
    maxLength: OTP_CODE_LENGTH,
    example: '123456',
  })
  otp: string;
}
