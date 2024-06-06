import { Controller, Get, Query } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { z } from 'zod';
import { entityIdSchema } from '../../domain/fleets/validation-schemas/entity-id.schema';
import { NavigationManager } from '../../domain/navigation/navigation.manager';
import { GetRouteSuggestionsQueryParams } from './http-bodies/navigation/get-route-suggestions.query-params';
import { ZodValidationPipe } from './zod-validation.pipe';

export const getStationsInLineDtoSchema = z.object({
  lineId: entityIdSchema,
});

export class GetStationsInLineDto
  implements z.infer<typeof getStationsInLineDtoSchema>
{
  @ApiProperty({
    format: 'uuid',
    type: String,
  })
  lineId: string;
  static schema = getStationsInLineDtoSchema;
}

@Controller('navigation')
@ApiTags('navigation')
export class NavigationController {
  constructor(private readonly navigationManager: NavigationManager) {}

  @Get('get-lines')
  async getLines() {
    return await this.navigationManager.getLines();
  }

  @Get('get-stations-in-line')
  async getStationsInLine(
    @Query(new ZodValidationPipe(GetStationsInLineDto.schema))
    params: GetStationsInLineDto,
  ) {
    return await this.navigationManager.getStationsInLine(params.lineId);
  }

  @Get('get-route-suggestions')
  async getRouteSuggestions(
    @Query()
    query: GetRouteSuggestionsQueryParams,
  ) {
    return await this.navigationManager.getSuggestionsBetweenStations(query);
  }
}
