import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Fleet } from 'src/domain/fleets/entities/fleet.entity';
import { RepositoryErrors } from '../../domain/_shared/repository.interface';
import {
  FleetIsFullError,
  JoinRequestAlreadyHandledError,
  UserAlreadyHasAFleetError,
  UserAlreadyRequestedToJoinFleetError,
  UserNotMeetingConstraintsError,
} from '../../domain/fleets/errors/errors';
import { FleetsManager } from '../../domain/fleets/fleets.manager';
import { getCreateFleetPayloadSchema } from '../../domain/fleets/validation-schemas/create-fleet-options.schema';
import { UserId } from '../../domain/users/entities/user.types';
import { CallerUserId } from '../../infrastructure/authentication/guards/decorators/caller-user-id.param-decorator';
import { UserAuthenticated } from '../../infrastructure/authentication/guards/user-authenticated.auth-guard';
import { StationOrLineNotFoundError } from '../../infrastructure/repositories/fleets.repository';
import { generateOpenApiSchema } from '../../utils';
import { RespondToRequestHttpBody } from './http-bodies/fleets/respond-to-request.http-body';
import { SearchFleetsQueryParams } from './http-bodies/fleets/search-fleets.query-params';
@ApiTags('fleets')
@Controller('fleets')
export class FleetsController {
  constructor(private readonly fleetsManager: FleetsManager) {}

  @ApiOkResponse({
    description: 'The created Fleet',
  })
  @UseGuards(UserAuthenticated)
  @ApiBearerAuth()
  @Post('create-fleet')
  @ApiBody({
    schema: generateOpenApiSchema(
      getCreateFleetPayloadSchema({
        minDepartureDelay: 5,
        minGatheringDelay: 5,
        maxGatheringDelay: 5,
      }),
    ),
  })
  async createFleet(
    @Body()
    body: any,
    @CallerUserId({
      required: true,
    })
    userId: UserId,
  ): Promise<Fleet> {
    try {
      return await this.fleetsManager.createFleet({
        ...body,
        departureTime: new Date(body.departureTime),
        administratorId: userId,
      });
    } catch (error) {
      if (error instanceof StationOrLineNotFoundError) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof UserAlreadyHasAFleetError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @ApiOkResponse({
    description: 'Fleets found',
  })
  @UseGuards(UserAuthenticated)
  @ApiBearerAuth()
  @Get('search-fleets')
  async searchFleets(
    @Query()
    query: SearchFleetsQueryParams,
    @CallerUserId({
      required: true,
    })
    userId: UserId,
  ): Promise<Fleet[]> {
    return await this.fleetsManager.searchFleets({
      ...query,
      departureTime: new Date(query.departureTime),
      searcherId: userId,
    });
  }

  @Get('current')
  @ApiOkResponse({
    description: 'Current fleet found',
  })
  @ApiBearerAuth()
  @UseGuards(UserAuthenticated)
  async getCurrentFleet(@CallerUserId() userId: UserId | null) {
    if (!userId) {
      throw new UnauthorizedException();
    }
    try {
      return await this.fleetsManager.getFleet({
        userId: userId,
      });
    } catch (error) {
      if (error instanceof RepositoryErrors.EntityNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}

@ApiTags('fleets')
@Controller('fleets/:fleetId')
@ApiForbiddenResponse()
export class SingleFleetController {
  constructor(private readonly fleetsManager: FleetsManager) {}
  @Get()
  @ApiOkResponse({
    description: 'Fleet found',
  })
  @ApiParam({
    name: 'fleetId',
    type: String,
    description: 'The id of the fleet',
  })
  @ApiBearerAuth()
  @UseGuards(UserAuthenticated)
  async getFleet(
    @Param('fleetId') fleetId: string | null,
    @CallerUserId({
      required: true,
    })
    userId: UserId,
  ) {
    if (!fleetId) throw new BadRequestException('Missing fleetId');
    try {
      return await this.fleetsManager.getFleet({
        fleetId,
        userId,
      });
    } catch (error) {
      if (error instanceof RepositoryErrors.EntityNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get('list-join-requests')
  @ApiOkResponse({
    description: 'Join requests found',
  })
  @ApiParam({
    name: 'fleetId',
    type: String,
    description: 'The id of the fleet',
  })
  @ApiBearerAuth()
  @UseGuards(UserAuthenticated)
  async listJoinRequests(
    @Param('fleetId') fleetId: string | null,
    @CallerUserId({
      required: true,
    })
    userId: UserId,
  ) {
    if (!fleetId) {
      throw new BadRequestException('Missing fleetId');
    }
    return await this.fleetsManager.listJoinRequests({
      fleetId,
      administratorId: userId,
    });
  }

  @Post('request-to-join')
  @ApiBearerAuth()
  @UseGuards(UserAuthenticated)
  @ApiCreatedResponse({
    description: 'Request to join sent',
  })
  @ApiParam({
    name: 'fleetId',
    type: String,
    description: 'The id of the fleet',
  })
  async requestToJoin(
    @CallerUserId({
      required: true,
    })
    userId: UserId,
    @Param('fleetId') fleetId: string | null,
  ) {
    if (!fleetId) throw new BadRequestException('Missing fleetId');
    try {
      return await this.fleetsManager.requestToJoinFleet({
        fleetId,
        userId: userId,
      });
    } catch (error) {
      for (const instance of [
        UserNotMeetingConstraintsError,
        FleetIsFullError,
        UserAlreadyHasAFleetError,
        UserAlreadyRequestedToJoinFleetError,
      ]) {
        if (error instanceof instance) {
          throw new BadRequestException(error.message);
        }
      }
      throw error;
    }
  }

  @Post('respond-to-request')
  @ApiBearerAuth()
  @UseGuards(UserAuthenticated)
  @ApiOkResponse({
    description: 'Request responded',
  })
  @ApiParam({
    name: 'fleetId',
    type: String,
    description: 'The id of the fleet',
  })
  async respondToRequest(
    @Param('fleetId') fleetId: string | null,
    @CallerUserId({
      required: true,
    })
    userId: UserId,
    @Body()
    body: RespondToRequestHttpBody,
  ) {
    if (!fleetId) throw new BadRequestException('Missing fleetId');
    try {
      return await this.fleetsManager.respondToFleetRequest({
        fleetId,
        userId: body.userId,
        accepted: body.accepted,
        administratorId: userId,
      });
    } catch (error) {
      for (const instance of [
        FleetIsFullError,
        UserAlreadyHasAFleetError,
        JoinRequestAlreadyHandledError,
        RepositoryErrors.EntityNotFoundError,
      ]) {
        if (error instanceof instance) {
          throw new BadRequestException(error.message);
        }
      }
      throw error;
    }
  }

  @Post('confirm-presence-at-station')
  @ApiBearerAuth()
  @UseGuards(UserAuthenticated)
  @ApiNoContentResponse({
    description: 'Presence confirmed',
  })
  @ApiParam({
    name: 'fleetId',
    type: String,
    description: 'The id of the fleet',
  })
  async confirmPresenceAtStation(
    @Param('fleetId') fleetId: string | null,
    @CallerUserId({
      required: true,
    })
    userId: UserId,
  ) {
    if (!fleetId) throw new BadRequestException('Missing fleetId');
    try {
      return await this.fleetsManager.confirmPresenceAtGathering({
        fleetId,
        memberId: userId,
      });
    } catch (error) {
      if (error instanceof RepositoryErrors.RepositoryError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Post('end')
  @ApiBearerAuth()
  @UseGuards(UserAuthenticated)
  @ApiOkResponse({
    description: 'Fleet ended',
  })
  @ApiParam({
    name: 'fleetId',
    type: String,
    description: 'The id of the fleet',
  })
  async endFleet(
    @Param('fleetId') fleetId: string | null,
    @CallerUserId({
      required: true,
    })
    userId: UserId,
  ) {
    if (!fleetId) throw new BadRequestException('Missing fleetId');
    try {
      return await this.fleetsManager.endFleet({
        fleetId,
        administratorId: userId,
      });
    } catch (error) {
      if (error instanceof RepositoryErrors.EntityNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Post('remove-member')
  @ApiBearerAuth()
  @UseGuards(UserAuthenticated)
  @ApiOkResponse({
    description: 'Fleet ended',
  })
  @ApiParam({
    name: 'fleetId',
    type: String,
    description: 'The id of the fleet',
  })
  async removeFleetMember(
    @Param('fleetId')
    fleetId: string | null,
    @CallerUserId({
      required: true,
    })
    userId: UserId,
  ) {
    const { userId: memberId } = body;
    if (!fleetId || !memberId)
      throw new BadRequestException('Missing fleetId or memberId');
    try {
      return await this.fleetsManager.removeFleetMember({
        fleetId,
        memberId,
        administratorId: userId,
      });
    } catch (error) {
      if (error instanceof RepositoryErrors.EntityNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
