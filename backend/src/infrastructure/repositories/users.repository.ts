import { Injectable } from '@nestjs/common';
import { $Enums, Prisma } from '@prisma/client';
import { RepositoryErrors } from '../../domain/_shared/repository.interface';
import { User } from '../../domain/users/entities/user.entity';
import {
  ExistsReturn,
  GetUserByIdOptions,
  GetUserByIdReturnType,
  IUsersRepository,
  OneTimePassword,
  UserOrPendingUser,
} from '../../domain/users/interfaces/users-repository.interface';
import { PrismaService } from '../persistence/read-database/prisma/prisma.service';
import { PendingUser } from '../../domain/users/entities/pending-user.entity';
import { GenderEnumToDatabase } from '../../domain/users/entities/user.types';
@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private prisma: PrismaService) {}

  async updateUser(user: UserOrPendingUser): Promise<UserOrPendingUser> {
    const where: Prisma.UserWhereUniqueInput = {
      id: user.id,
    };
    let gender: $Enums.Gender | undefined;
    if (user.gender) {
      gender = GenderEnumToDatabase[user.gender];
    }
    const data: Prisma.XOR<
      Prisma.UserUpdateInput,
      Prisma.UserUncheckedUpdateInput
    > = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      birthDate: user.birthDate,
      gender,
      isOnboarded: user.isOnboarded,
    };
    const updatedUser = await this.prisma.user.update({
      where,
      data,
    });
    return User.fromDatabase(updatedUser);
  }

  async deleteOTP(email: string): Promise<void> {
    await this.prisma.oneTimePassword.delete({
      where: {
        email: email,
      },
    });
  }

  async existsByEmail(email: string): Promise<ExistsReturn> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return { exists: false };
    }
    return { exists: true, id: user.id };
  }

  async createPendingUser(user: PendingUser): Promise<PendingUser> {
    const data: Prisma.UserCreateInput = {
      id: user.id,
      email: user.email,
      isOnboarded: false,
    };
    const createdUser = await this.prisma.user.create({
      data,
    });
    return PendingUser.fromDatabase(createdUser);
  }

  async getOTP(email: string): Promise<OneTimePassword> {
    const otp = await this.prisma.oneTimePassword.findFirstOrThrow({
      where: {
        email: email,
      },
    });
    return otp;
  }

  async setOTP(email: string, otp: string, expiry: Date): Promise<void> {
    await this.prisma.oneTimePassword.upsert({
      update: {
        email: email,
        code: otp,
        expiresAt: expiry,
      },
      create: {
        email: email,
        code: otp,
        expiresAt: expiry,
      },
      where: {
        email: email,
      },
    });
  }

  async getUserByEmail(email: string): Promise<UserOrPendingUser> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new RepositoryErrors.EntityNotFoundError(User, email);
    }
    if (user.isOnboarded) {
      return User.fromDatabase(user);
    } else {
      return PendingUser.fromDatabase(user);
    }
  }

  async getUserById<TIncludePending extends boolean>(
    options: GetUserByIdOptions & {
      includePending: TIncludePending;
    },
  ): Promise<GetUserByIdReturnType<TIncludePending>> {
    const { id, include, includePending } = options;
    const user = await this.prisma.user.findUnique({
      where: { id },
      include,
    });
    if (!user) {
      throw new RepositoryErrors.EntityNotFoundError(
        includePending ? PendingUser : User,
        id,
      );
    }
    if (!user.isOnboarded && !includePending) {
      throw new RepositoryErrors.EntityNotFoundError(PendingUser, id);
    }
    return (
      user.isOnboarded
        ? User.fromDatabase(user)
        : PendingUser.fromDatabase(user)
    ) as GetUserByIdReturnType<TIncludePending>;
  }
}
