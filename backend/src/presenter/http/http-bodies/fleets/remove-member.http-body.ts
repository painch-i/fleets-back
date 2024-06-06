import { ApiProperty } from '@nestjs/swagger';
export class RemoveMemberHttpBody {
  @ApiProperty()
  userId: string;
}
