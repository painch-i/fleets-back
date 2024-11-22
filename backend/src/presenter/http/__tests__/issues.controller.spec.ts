import { Test } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IssuesManager } from '../../../domain/issues/issues.manager';
import { IssueType } from '../../../domain/issues/issues.types';
import { IssuesController } from '../issues.controller';

describe('IssuesController', () => {
  let issuesController: IssuesController;
  let issuesManager: { createIssue: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    const mockIssuesManager = {
      createIssue: vi.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [IssuesController],
      providers: [
        {
          provide: IssuesManager,
          useValue: mockIssuesManager,
        },
      ],
    }).compile();

    issuesController = moduleRef.get<IssuesController>(IssuesController);
    issuesManager = moduleRef.get(IssuesManager);
  });

  describe('createIssue', () => {
    it('should create an issue', async () => {
      const userId = 'user-123';
      const body = {
        type: IssueType.Technical,
        description: 'Test issue',
      } as const;

      await issuesController.createIssue(userId, body);

      expect(issuesManager.createIssue).toHaveBeenCalledWith({
        payload: body,
        reporterId: userId,
      });
    });
  });
});
