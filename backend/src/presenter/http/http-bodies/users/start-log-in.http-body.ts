import { ApiProperty } from '@nestjs/swagger';

export class StartLogInHttpBody {
  @ApiProperty({
    type: 'string',
    format: 'email',
    example: 'painch_i@etna-alternance.net',
  })
  email: string;
}
