import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
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
import { UserReference } from '../../domain/users/value-objects/user-reference.value-object';
import { UserFromRequest } from '../../infrastructure/authentication/guards/decorators/user-reference.param-decorator';
import { UserAuthenticated } from '../../infrastructure/authentication/guards/user-authenticated.auth-guard';
import { StationOrLineNotFoundError } from '../../infrastructure/repositories/fleets.repository';
import { CreateFleetHttpBody } from './http-bodies/fleets/create-fleet.http-body';
import { RemoveMemberHttpBody } from './http-bodies/fleets/remove-member.http-body';
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
  async createFleet(
    @Body()
    body: CreateFleetHttpBody,
    @UserFromRequest() userReference: UserReference | null,
  ): Promise<Fleet> {
    if (!userReference) throw new HttpException('Unauthorized', 401);
    try {
      return await this.fleetsManager.createFleet({
        ...body,
        departureTime: new Date(body.departureTime),
        administratorId: userReference.getId(),
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
    @UserFromRequest() userReference: UserReference | null,
  ): Promise<Fleet[]> {
    if (!userReference) throw new HttpException('Unauthorized', 401);

    return await this.fleetsManager.searchFleets({
      ...query,
      departureTime: new Date(query.departureTime),
      searcherId: userReference.getId(),
    });
  }

  @Get('current')
  @ApiOkResponse({
    description: 'Current fleet found',
  })
  @ApiBearerAuth()
  @UseGuards(UserAuthenticated)
  async getCurrentFleet(
    @UserFromRequest() userReference: UserReference | null,
  ) {
    if (!userReference) {
      throw new UnauthorizedException();
    }
    try {
      return await this.fleetsManager.getFleet({
        userId: userReference.getId(),
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
    @UserFromRequest() userReference: UserReference | null,
  ) {
    if (!fleetId) throw new BadRequestException('Missing fleetId');
    try {
      return await this.fleetsManager.getFleet({
        fleetId,
        userId: userReference?.getId(),
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
    @UserFromRequest() userReference: UserReference | null,
  ) {
    if (!fleetId) {
      throw new BadRequestException('Missing fleetId');
    }
    if (!userReference) {
      throw new UnauthorizedException();
    }
    return await this.fleetsManager.listJoinRequests({
      fleetId,
      administratorId: userReference.getId(),
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
    @UserFromRequest() userReference: UserReference | null,
    @Param('fleetId') fleetId: string | null,
  ) {
    if (!userReference) throw new HttpException('Unauthorized', 401);
    if (!fleetId) throw new BadRequestException('Missing fleetId');
    try {
      return await this.fleetsManager.requestToJoinFleet({
        fleetId,
        userId: userReference.getId(),
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
    @UserFromRequest() userReference: UserReference | null,
    @Body()
    body: RespondToRequestHttpBody,
  ) {
    if (!fleetId) throw new BadRequestException('Missing fleetId');
    if (!userReference) throw new UnauthorizedException();
    try {
      return await this.fleetsManager.respondToFleetRequest({
        fleetId,
        userId: body.userId,
        accepted: body.accepted,
        administratorId: userReference.getId(),
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
    @UserFromRequest() userReference: UserReference | null,
  ) {
    if (!fleetId) throw new BadRequestException('Missing fleetId');
    if (!userReference) throw new UnauthorizedException();
    try {
      return await this.fleetsManager.confirmPresenceAtGathering({
        fleetId,
        memberId: userReference.getId(),
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
    @UserFromRequest() userReference: UserReference | null,
  ) {
    if (!fleetId) throw new BadRequestException('Missing fleetId');
    if (!userReference) throw new UnauthorizedException();
    try {
      return await this.fleetsManager.endFleet({
        fleetId,
        administratorId: userReference.getId(),
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
    @Param('fleetId') fleetId: string | null,
    @Body()
    body: RemoveMemberHttpBody,
    @UserFromRequest() userReference: UserReference | null,
  ) {
    const { userId: memberId } = body;
    if (!fleetId || !memberId)
      throw new BadRequestException('Missing fleetId or userId');
    if (!userReference) throw new UnauthorizedException();
    try {
      return await this.fleetsManager.removeFleetMember({
        fleetId,
        memberId,
        administratorId: userReference.getId(),
      });
    } catch (error) {
      if (error instanceof RepositoryErrors.EntityNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
