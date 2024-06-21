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
  ApiParam,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { z } from 'zod';
import { RepositoryErrors } from '../../domain/_shared/repository.interface';
import { UsersManager } from '../../domain/users/users.manager';
import { ClearPassword } from '../../domain/users/value-objects/clear-password.value-object';
import { Email } from '../../domain/users/value-objects/email.value-object';
import {
  Gender,
  GenderEnum,
} from '../../domain/users/value-objects/gender.value-object';
import { UserReference } from '../../domain/users/value-objects/user-reference.value-object';
import { UserFromRequest } from '../../infrastructure/authentication/guards/decorators/user-reference.param-decorator';
import { UserAuthenticated } from '../../infrastructure/authentication/guards/user-authenticated.auth-guard';
import { EtnaApi } from '../../infrastructure/schools/etna.api';
import { CompleteRegistrationHttpBody } from './http-bodies/users/complete-registration.http-body';
import { StartLogInHttpBody } from './http-bodies/users/start-log-in.http-body';
import { StartRegistrationHttpBody } from './http-bodies/users/start-registration.http-body';
import { TokenResponseHttpBody } from './http-bodies/users/token-response.http-body';
import { VerifyOTPHttpBody } from './http-bodies/users/verify-otp.http-body';

export const createUserDtoSchema = z.object({
  email: Email.getSchema(),
  password: ClearPassword.getSchema(),
  gender: Gender.getSchema(),
});

export class HttpBodyDto {}
export class CreateUserDto
  extends HttpBodyDto
  implements z.infer<typeof createUserDtoSchema>
{
  @ApiProperty({ type: 'string', format: 'email' })
  email: string;

  @ApiProperty({ type: 'string', format: 'password' })
  password: string;

  @ApiProperty({ type: 'string', enum: GenderEnum })
  gender: GenderEnum;

  static schema = createUserDtoSchema;
}

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersManager: UsersManager,
    private readonly etnaApi: EtnaApi,
  ) {}

  @Get('me')
  @ApiTags('users')
  @ApiBearerAuth()
  @UseGuards(UserAuthenticated)
  async getMe(@UserFromRequest() userReference: UserReference) {
    const id = userReference.getId();
    return await this.usersManager.getUserById(id);
  }

  @Post('start-login')
  @ApiTags('users')
  @HttpCode(HttpStatus.ACCEPTED)
  async login(@Body() body: StartLogInHttpBody) {
    return await this.usersManager.startLogIn(body);
  }

  @Post('start-registration')
  @ApiTags('users')
  @HttpCode(HttpStatus.ACCEPTED)
  async register(@Body() body: StartRegistrationHttpBody) {
    return await this.usersManager.startRegistration(body);
  }

  @Post('verify-otp')
  @ApiTags('users')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    type: TokenResponseHttpBody,
  })
  async verifyOtp(
    @Body() body: VerifyOTPHttpBody,
  ): Promise<TokenResponseHttpBody> {
    const token = await this.usersManager.verifyOTP(body);
    return { token, type: 'Bearer' };
  }

  @Post('complete-registration')
  @ApiTags('users')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(UserAuthenticated)
  async completeRegistration(
    @Body() body: CompleteRegistrationHttpBody,
    @UserFromRequest() userReference: UserReference,
  ) {
    return await this.usersManager.completeRegistration({
      id: userReference.getId(),
      ...body,
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
}
