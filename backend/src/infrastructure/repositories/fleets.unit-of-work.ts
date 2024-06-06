import { Injectable } from '@nestjs/common';
import { IFleetsRepository } from '../../domain/fleets/interfaces/fleets-repository.interface';
import { IUsersRepository } from '../../domain/users/interfaces/users-repository.interface';
import { PrismaService } from '../persistence/read-database/prisma/prisma.service';
import { FleetsRepository } from './fleets.repository';
import { UsersRepository } from './users.repository';

@Injectable()
export class FleetsUnitOfWork {
  constructor(private readonly prismaService: PrismaService) {}
  async withTransaction<T>(
    work: (
      fleetsRepository: IFleetsRepository,
      usersRepository: IUsersRepository,
    ) => Promise<T>,
  ) {
    return await this.prismaService.$transaction(
      async (prisma) => {
        return await work(
          new FleetsRepository(prisma as any),
          new UsersRepository(prisma as any),
        );
      },
      {
        timeout: 10000,
      },
    );
  }
}
