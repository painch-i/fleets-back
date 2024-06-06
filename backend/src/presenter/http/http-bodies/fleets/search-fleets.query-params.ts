import { ApiProperty } from '@nestjs/swagger';

export class SearchFleetsQueryParams {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
  })
  startStationId: string;

  @ApiProperty({
    type: 'string',
    format: 'uuid',
  })
  endStationId: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  departureTime: string;
}
