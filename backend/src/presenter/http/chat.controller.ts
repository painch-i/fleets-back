import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
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
import { ChatManager } from '../../domain/chat/chat.manager';
import { UserId } from '../../domain/users/entities/user.types';
import { CallerUserId } from '../../infrastructure/authentication/guards/decorators/caller-user-id.param-decorator';
import { UserAuthenticated } from '../../infrastructure/authentication/guards/user-authenticated.auth-guard';
import { SendMessageHttpBody } from './http-bodies/chat/send-message.http-body';
import { ZodValidationPipe } from './zod-validation.pipe';

@Controller('fleets/:fleetId')
@ApiBearerAuth()
@UseGuards(UserAuthenticated)
@ApiTags('chat')
export class ChatController {
  constructor(
    @Inject(ChatManager)
    private readonly chatManager: ChatManager,
  ) {}

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
    @CallerUserId({
      required: true,
    })
    userId: UserId,
    @Body(new ZodValidationPipe(SendMessageHttpBody.getSchema()))
    body: SendMessageHttpBody,
  ) {
    if (!fleetId) throw new BadRequestException('Missing fleetId');
    try {
      return await this.chatManager.sendMessage({
        fleetId,
        authorId: userId,
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
