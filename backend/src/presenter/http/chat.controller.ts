import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { RepositoryErrors } from '../../domain/_shared/repository.interface';
import { UserReference } from '../../domain/users/value-objects/user-reference.value-object';
import { UserFromRequest } from '../../infrastructure/authentication/guards/decorators/user-reference.param-decorator';
import { UserAuthenticated } from '../../infrastructure/authentication/guards/user-authenticated.auth-guard';
import { SendMessageHttpBody } from './http-bodies/chat/send-message.http-body';
import { ZodValidationPipe } from './zod-validation.pipe';
import { ChatManager } from '../../domain/chat/chat.manager';

@Controller('fleets/:fleetId')
@ApiBearerAuth()
@UseGuards(UserAuthenticated)
@ApiTags('chat')
export class ChatController {
  constructor(private readonly chatManager: ChatManager) {}

  @Get('get-messages')
  @ApiOkResponse({
    description: 'Messages found',
  })
  @ApiParam({
    name: 'fleetId',
    type: String,
    description: 'The id of the fleet',
  })
  async getFleetMessages(@Param('fleetId') fleetId: string | null) {
    if (!fleetId) throw new BadRequestException('Missing fleetId');
    try {
      return await this.chatManager.getFleetMessages(fleetId);
    } catch (error) {
      if (error instanceof RepositoryErrors.EntityNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Post('send-message')
  @ApiOkResponse({
    description: 'Message sent',
  })
  @ApiParam({
    name: 'fleetId',
    type: String,
    description: 'The id of the fleet',
  })
  async sendFleetMessage(
    @Param('fleetId') fleetId: string | null,
    @UserFromRequest() userReference: UserReference | null,
    @Body(new ZodValidationPipe(SendMessageHttpBody.getSchema()))
    body: SendMessageHttpBody,
  ) {
    if (!fleetId) throw new BadRequestException('Missing fleetId');
    if (!userReference) throw new BadRequestException('Missing user');
    try {
      return await this.chatManager.sendMessage({
        fleetId,
        authorId: userReference.getId(),
        content: body.content,
      });
    } catch (error) {
      if (error instanceof RepositoryErrors.EntityNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
