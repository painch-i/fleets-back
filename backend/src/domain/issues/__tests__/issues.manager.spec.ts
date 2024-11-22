import { Test } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IssuesService } from '../../../infrastructure/repositories/issues.service';
import { IssuesManager } from '../issues.manager';
import { IssueType } from '../issues.types';

describe('IssuesManager', () => {
  let issuesManager: IssuesManager;
  let issuesService: { createIssue: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    const mockIssuesService = {
      createIssue: vi.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        IssuesManager,
        {
          provide: IssuesService,
          useValue: mockIssuesService,
        },
      ],
    }).compile();

    issuesManager = moduleRef.get<IssuesManager>(IssuesManager);
    issuesService = moduleRef.get(IssuesService);
  });

  describe('createIssue', () => {
    it('should create an issue successfully', async () => {
      const createIssueOptions = {
        reporterId: 'user-123',
        payload: {
          type: IssueType.Technical,
          description: 'Test issue',
        },
      } as const;

      await issuesManager.createIssue(createIssueOptions);

      expect(issuesService.createIssue).toHaveBeenCalledWith(
        createIssueOptions,
      );
    });
  });
});
