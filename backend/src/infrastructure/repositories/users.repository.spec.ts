import { Test } from '@nestjs/testing';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { RepositoryErrors } from '../../domain/_shared/repository.interface';
import { User } from '../../domain/users/entities/user.entity';
import { Email } from '../../domain/users/value-objects/email.value-object';
import { PrismaService } from '../persistence/read-database/prisma/prisma.service';
import { UsersRepository } from './users.repository';

describe('UsersRepository', () => {
  let usersRepository: UsersRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    usersRepository = moduleRef.get<UsersRepository>(UsersRepository);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  describe('preRegisterUser', () => {
    it('should pre-register a user successfully', async () => {
      // Arrange
      const email = new Email('test@example.com');
      const user = User.create(email);

      // Mock the Prisma response for successful user creation
      const prismaCreateMock = prismaService.user.create as jest.Mock;
      const mockPrismaUser = {
        id: user.id.getValue(),
        email: user.email.getValue(),
        isPreRegistered: user.isPreRegistered,
        isRegistered: user.isRegistered,
      };
      prismaCreateMock.mockResolvedValue(mockPrismaUser);

      // Act
      const preRegisteredUser = await usersRepository.preRegisterUser(user);

      // Assert
      expect(preRegisteredUser).toBeDefined();
      expect(preRegisteredUser.id.getValue()).toBe(mockPrismaUser.id);
      expect(preRegisteredUser.email.getValue()).toBe(mockPrismaUser.email);
      expect(preRegisteredUser.isPreRegistered).toBe(
        mockPrismaUser.isPreRegistered,
      );
      expect(preRegisteredUser.isRegistered).toBe(mockPrismaUser.isRegistered);
    });

    it('should throw UserRepositoryError if user with same email already pre-registered', async () => {
      // Arrange
      const email = new Email('test@example.com');
      const user = User.create(email);

      // Mock the Prisma response for user creation with unique constraint error
      const prismaCreateMock = prismaService.user.create as jest.Mock;
      prismaCreateMock.mockRejectedValue(
        new PrismaClientKnownRequestError('Unique constraint failed', {
          code: 'P2002',
          meta: {
            target: ['email'],
          },
          clientVersion: '5.0',
        }),
      );

      // Act and Assert
      await expect(usersRepository.preRegisterUser(user)).rejects.toThrow(
        RepositoryErrors.EntityAlreadyExistsError,
      );
    });

    it('should throw RepositoryError if Prisma throws an unknown error', async () => {
      // Arrange
      const email = new Email('test@example.com');
      const user = User.create(email);

      // Mock the Prisma response for user creation with unique constraint error
      const prismaCreateMock = prismaService.user.create as jest.Mock;
      prismaCreateMock.mockRejectedValue(
        new Error('Unknown Prisma error message'),
      );

      // Act and Assert
      await expect(usersRepository.preRegisterUser(user)).rejects.toThrow(
        RepositoryErrors.RepositoryError,
      );
    });
  });
});
