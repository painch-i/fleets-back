import { ApiProperty } from '@nestjs/swagger';
import { GenderConstraintCreationConfigEnum } from '../../../../domain/fleets/fleets.types';

class VehicleNameTextHttpBody {
  @ApiProperty({
    description: 'The text of the vehicle name',
  })
  text: string;
}

class VehicleNameHttpBody {
  @ApiProperty({
    description: 'The text of the vehicle name',
  })
  text: VehicleNameTextHttpBody;
}

class VehicleHttpBody {
  @ApiProperty({
    description: 'The name of the vehicle',
  })
  name: VehicleNameHttpBody;

  @ApiProperty({
    description: 'The type of the vehicle',
  })
  type: string;

  @ApiProperty({
    description: 'The icon uri of the vehicle',
  })
  iconUri: string;
}

class LineTakenHttpBody {
  @ApiProperty({
    description: 'The name of the line taken',
  })
  name: string;

  @ApiProperty({
    description: 'The color of the line taken',
  })
  color: string;

  @ApiProperty({
    description: 'The short name of the line taken',
  })
  nameShort: string;

  @ApiProperty({
    description: 'The text color of the line taken',
  })
  textColor: string;

  @ApiProperty({
    description: 'The vehicle of the line taken',
    required: false,
  })
  vehicle: VehicleHttpBody;
}

class RouteHttpBody {
  @ApiProperty({
    description: 'The hash of the route',
  })
  hash: string;

  @ApiProperty({
    description: 'The line taken of the route',
    isArray: true,
    type: LineTakenHttpBody,
  })
  linesTaken: LineTakenHttpBody[];
}

export class CreateFleetHttpBody {
  @ApiProperty({
    description: 'The name of the fleet',
    example: 'My fleet',
  })
  name: string;

  @ApiProperty({
    description: 'The line id of the fleet',
  })
  lineId: string;

  @ApiProperty({
    description: 'The end station id of the fleet',
  })
  endStationId: string;

  @ApiProperty({
    description: 'The start station id of the fleet',
  })
  startStationId: string;

  @ApiProperty({
    description: 'The departure time of the fleet',
    type: 'string',
    format: 'date-time',
  })
  departureTime: string;

  @ApiProperty({
    description: 'The gathering delay of the fleet',
    type: 'number',
  })
  gatheringDelay: number;

  @ApiProperty({
    description: 'The gender constraint configuration of the fleet',
    type: 'string',
    enum: GenderConstraintCreationConfigEnum,
  })
  genderConstraintConfig: GenderConstraintCreationConfigEnum;

  @ApiProperty({
    description: 'The route of the fleet',
  })
  route: RouteHttpBody;
}
