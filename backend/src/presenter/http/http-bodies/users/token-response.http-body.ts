import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseHttpBody {
  @ApiProperty({
    type: 'string',
    description: 'The JWT token',
  })
  token: string;

  @ApiProperty({
    default: 'Bearer',
  })
  type: 'Bearer';
}
