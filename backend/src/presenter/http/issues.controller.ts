import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiTags,
} from '@nestjs/swagger';
import { createIssuePayloadSchema } from '../../domain/issues/create-issue-options.schemas';
import { IssuesManager } from '../../domain/issues/issues.manager';
import { UserId } from '../../domain/users/entities/user.types';
import { CallerUserId } from '../../infrastructure/authentication/guards/decorators/caller-user-id.param-decorator';
import { UserAuthenticated } from '../../infrastructure/authentication/guards/user-authenticated.auth-guard';
import { generateOpenApiSchema } from '../../utils';

@Controller('issues')
@ApiBearerAuth()
@UseGuards(UserAuthenticated)
@ApiTags('issues')
export class IssuesController {
  constructor(private readonly issuesManager: IssuesManager) {}

  @Post('create-issue')
  @ApiNoContentResponse({
    description: 'Issue created',
  })
  @ApiBody({
    schema: generateOpenApiSchema(createIssuePayloadSchema),
  })
  async createIssue(
    @CallerUserId({
      required: true,
    })
    userId: UserId,
    @Body()
    body: any,
  ) {
    return await this.issuesManager.createIssue({
      payload: body,
      reporterId: userId,
    });
  }
}
