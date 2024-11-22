import { Inject, Injectable, Logger } from '@nestjs/common';
import { IssuesService } from '../../infrastructure/repositories/issues.service';
import { IIssuesService } from './issues-service.interface';
import { CreateIssueOptions } from './issues.types';

@Injectable()
export class IssuesManager {
  private readonly logger = new Logger(IssuesManager.name);
  constructor(
    @Inject(IssuesService)
    private readonly issuesService: IIssuesService,
  ) {}

  async createIssue(options: CreateIssueOptions) {
    this.logger.log('Received request to create an issue');
    this.logger.debug(`CreateIssueOptions: ${JSON.stringify(options)}`);
    await this.issuesService.createIssue(options);
    this.logger.log('Issue created successfully');
  }
}
