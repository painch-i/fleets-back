import { Injectable } from '@nestjs/common';
import { $Enums, Prisma } from '@prisma/client';
import { IIssuesService } from '../../domain/issues/issues-service.interface';
import {
  CreateIssueOptions,
  IssueType,
} from '../../domain/issues/issues.types';
import { PrismaService } from '../persistence/read-database/prisma/prisma.service';

@Injectable()
export class IssuesService implements IIssuesService {
  constructor(private prisma: PrismaService) {}

  async createIssue(options: CreateIssueOptions): Promise<void> {
    const reporter = {
      connect: {
        id: options.reporterId,
      },
    } as const;
    const description = options.payload.description;
    const type = IssueEnumToPrismaEnum[options.payload.type];
    let createIssueOptions: Prisma.IssueCreateInput;
    switch (options.payload.type) {
      case IssueType.Fleet:
        createIssueOptions = {
          type,
          targetFleet: {
            connect: {
              id: options.payload.targetFleetId,
            },
          },
          reporter,
          description,
        };
        break;
      case IssueType.Technical:
        createIssueOptions = {
          type,
          reporter,
          description,
        };
        break;
      case IssueType.User:
        createIssueOptions = {
          type,
          targetUser: {
            connect: {
              id: options.payload.targetUserId,
            },
          },
          reporter,
          description,
        };
        break;
    }
    await this.prisma.issue.create({
      data: createIssueOptions,
    });
  }
}

const IssueEnumToPrismaEnum = {
  [IssueType.Fleet]: $Enums.IssueType.FLEET,
  [IssueType.Technical]: $Enums.IssueType.TECHNICAL,
  [IssueType.User]: $Enums.IssueType.USER,
} as const;
