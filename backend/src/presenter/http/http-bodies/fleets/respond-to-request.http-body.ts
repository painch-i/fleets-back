import { ApiProperty } from '@nestjs/swagger';

export class RespondToRequestHttpBody {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  accepted: boolean;
}
