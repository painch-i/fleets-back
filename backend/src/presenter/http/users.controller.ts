import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RepositoryErrors } from '../../domain/_shared/repository.interface';
import { UserId } from '../../domain/users/entities/user.types';
import { UsersManager } from '../../domain/users/users.manager';
import { completeRegistrationPayloadSchema } from '../../domain/users/validation/complete-registration-options.schema';
import { findUserByEmailOptionsSchema } from '../../domain/users/validation/find-by-email-options.schema';
import { setNotificationTokenPayloadSchema } from '../../domain/users/validation/set-notification-token-options.schema';
import { verifyOTPOptionsSchema } from '../../domain/users/validation/verify-otp-options.schema';
import { CallerUserId } from '../../infrastructure/authentication/guards/decorators/caller-user-id.param-decorator';
import { UserAuthenticated } from '../../infrastructure/authentication/guards/user-authenticated.auth-guard';
import { generateOpenApiSchema } from '../../utils';
import { TokenResponseHttpBody } from './http-bodies/users/token-response.http-body';
@Controller('users')
export class UsersController {
  constructor(private readonly usersManager: UsersManager) {}

  @Get('me')
  @ApiTags('users')
  @ApiBearerAuth()
  @UseGuards(UserAuthenticated)
  async getMe(
    @CallerUserId({
      required: true,
    })
    userId: UserId,
  ) {
    return await this.usersManager.getUserById(userId);
  }

  @Post('start-login')
  @ApiTags('users')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiBody({
    schema: generateOpenApiSchema(findUserByEmailOptionsSchema),
  })
  async login(@Body() body: any) {
    return await this.usersManager.startLogIn(body);
  }

  @Post('start-registration')
  @ApiTags('users')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiBody({
    schema: generateOpenApiSchema(findUserByEmailOptionsSchema),
  })
  async register(@Body() body: any) {
    return await this.usersManager.startRegistration(body);
  }

  @Post('verify-otp')
  @ApiTags('users')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    type: TokenResponseHttpBody,
  })
  @ApiBody({
    schema: generateOpenApiSchema(verifyOTPOptionsSchema),
  })
  async verifyOtp(@Body() body: any): Promise<TokenResponseHttpBody> {
    const token = await this.usersManager.verifyOTP(body);
    return { token, type: 'Bearer' };
  }

  @Post('complete-registration')
  @ApiTags('users')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(UserAuthenticated)
  @ApiBody({
    schema: generateOpenApiSchema(completeRegistrationPayloadSchema),
  })
  async completeRegistration(
    @Body() body: any,
    @CallerUserId({
      required: true,
    })
    userId: UserId,
  ) {
    return await this.usersManager.completeRegistration({
      ...body,
      id: userId,
    });
  }

  @Get(':userId')
  @UseGuards(UserAuthenticated)
  @ApiTags('users')
  @ApiBearerAuth()
  @ApiParam({
    name: 'userId',
    description: 'User id',
    type: String,
  })
  async getUserById(@Param('userId') userId: string | null) {
    if (!userId) {
      throw new BadRequestException('userId is required');
    }
    const id = userId;
    try {
      return await this.usersManager.getUserById(id);
    } catch (error) {
      if (error instanceof RepositoryErrors.EntityNotFoundError) {
        throw new NotFoundException(error.message);
      }
    }
  }

  @Post(':userId/set-notification-token')
  @UseGuards(UserAuthenticated)
  @ApiTags('users')
  @ApiBearerAuth()
  @ApiParam({
    name: 'userId',
    description: 'User id',
    type: String,
  })
  @ApiBody({
    schema: generateOpenApiSchema(setNotificationTokenPayloadSchema),
  })
  async setNotificationToken(
    @Body() body: any,
    @CallerUserId({
      required: true,
    })
    userId: UserId,
  ) {
    return await this.usersManager.setNotificationToken({
      updatePayload: body,
      updatedUserId: userId,
    });
  }
}
