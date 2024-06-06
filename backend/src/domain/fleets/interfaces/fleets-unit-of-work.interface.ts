import { IUsersRepository } from '../../users/interfaces/users-repository.interface';
import { IFleetsRepository } from './fleets-repository.interface';

export interface IFleetsUnitOfWork {
  withTransaction<T>(
    work: (
      fleetsRepository: IFleetsRepository,
      usersRepository: IUsersRepository,
    ) => Promise<T>,
  ): Promise<T>;
}
