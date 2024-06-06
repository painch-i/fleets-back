import { ApiProperty } from '@nestjs/swagger';

export class GetRouteSuggestionsQueryParams {
  @ApiProperty({
    format: 'uuid',
    type: String,
  })
  startStationId: string;

  @ApiProperty({
    format: 'uuid',
    type: String,
  })
  endStationId: string;
}
