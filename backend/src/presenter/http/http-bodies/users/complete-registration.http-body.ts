import { ApiProperty } from '@nestjs/swagger';
import { GenderEnum } from '../../../../domain/users/value-objects/gender.value-object';

export class CompleteRegistrationHttpBody {
  @ApiProperty({ type: 'string', example: 'Jane' })
  firstName: string;

  @ApiProperty({ type: 'string', example: 'Doe' })
  lastName: string;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'ISO 8601',
    example: '1990-01-01T00:00:00+01:00',
  })
  birthDate: Date;

  @ApiProperty({ type: 'string', enum: GenderEnum })
  gender: GenderEnum;
}
