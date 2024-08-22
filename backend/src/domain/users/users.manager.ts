import { Inject, Injectable } from '@nestjs/common';
import { AuthService } from '../../infrastructure/authentication/auth.service';
import { EventStore } from '../../infrastructure/events/event-store.service';
import { FeatureFlagsService } from '../../infrastructure/feature-flags/feature-flags.service';
import { UsersRepository } from '../../infrastructure/repositories/users.repository';
import { EtnaApi } from '../../infrastructure/schools/etna.api';
import { Id } from '../../types';
import { IAuthService } from '../_shared/auth-service.interface';
import { Issue, ValidationError } from '../_shared/errors/validation.error';
import { IEventStore } from '../_shared/event-store.interface';
import { IFeatureFlagsService } from '../_shared/feature-flags-service.interface';
import { MailsManager } from '../mailing/mails.manager';
import { PendingUser } from './entities/pending-user.entity';
import { User } from './entities/user.entity';
import {
  CompleteRegistrationOptions,
  CreatePendingUserOptions,
  FindUserByEmailOptions,
  UserNetwork,
  VerifyOTPOptions,
} from './entities/user.types';
import { IEtnaApi } from './interfaces/etna-api.interface';
import { IUsersRepository } from './interfaces/users-repository.interface';
import { completeRegistrationOptionsSchema } from './validation/complete-registration-options.schema';
import { findUserByEmailOptionsSchema } from './validation/find-by-email-options.schema';
import { verifyOTPOptionsSchema } from './validation/verify-otp-options.schema';
@Injectable()
export class UsersManager {
  constructor(
    @Inject(UsersRepository)
    private readonly usersRepository: IUsersRepository,
    @Inject(EventStore)
    private readonly eventStore: IEventStore,
    @Inject(AuthService)
    private readonly authService: IAuthService,
    private readonly mailsManager: MailsManager,
    @Inject(FeatureFlagsService)
    private readonly featureFlagsService: IFeatureFlagsService,

    @Inject(EtnaApi)
    private readonly etnaApi: IEtnaApi,
  ) {}

  async startLogIn(options: FindUserByEmailOptions) {
    findUserByEmailOptionsSchema.parse(options);
    const existsResponse = await this.usersRepository.existsByEmail(
      options.email,
    );
    if (!existsResponse.exists) {
      const issue: Issue = {
        code: 'user-not-found',
        path: ['email'],
      };
      throw new ValidationError('User not found', [issue]);
    }
    await this.sendOTP({ email: options.email }, false);
    await this.eventStore.store({
      aggregateId: existsResponse.id,
      aggregateType: 'user',
      eventType: 'login-started',
      createdAt: new Date(),
      payload: options,
    });
  }

  async startRegistration(options: FindUserByEmailOptions) {
    findUserByEmailOptionsSchema.parse(options);
    const { exists } = await this.usersRepository.existsByEmail(options.email);
    if (exists) {
      const issue: Issue = {
        code: 'email-in-use',
        path: ['email'],
      };
      throw new ValidationError('Email already in use', [issue]);
    }
    await this.sendOTP({ email: options.email }, false);
    await this.eventStore.store({
      aggregateId: options.email,
      aggregateType: 'user',
      eventType: 'registration-started',
      createdAt: new Date(),
      payload: options,
    });
  }

  async completeRegistration(options: CompleteRegistrationOptions) {
    completeRegistrationOptionsSchema.parse(options);
    const user = new User(options.id);
    user.completeRegistration(options);
    await this.usersRepository.updateUser(user);
    await this.eventStore.store({
      aggregateId: user.id,
      aggregateType: 'user',
      eventType: 'registration-completed',
      createdAt: new Date(),
      payload: options,
    });
  }

  async verifyOTP(options: VerifyOTPOptions) {
    const bypassOtp = this.featureFlagsService.isEnabled(
      'bypass-otp-verification',
    );
    verifyOTPOptionsSchema.parse(options);
    const { email, otp } = options;
    const isOtpValid = await this.authService.verifyOTP(email, otp);
    if (!isOtpValid) {
      const issue: Issue = {
        code: 'invalid-otp',
        path: ['otp'],
      };
      throw new ValidationError('Invalid OTP', [issue]);
    }
    // Create user if not exists
    const existsResponse = await this.usersRepository.existsByEmail(email);
    let userId: Id;
    if (!existsResponse.exists) {
      const createOptions: CreatePendingUserOptions = {
        email,
      };

      const isEtnaEmail = email.endsWith('@etna-alternance.net');
      if (isEtnaEmail) {
        const login = email.split('@')[0];
        try {
          const userEtnaInfos = await this.etnaApi.getUserInfo(login);
          createOptions.firstName = userEtnaInfos.firstName;
          createOptions.lastName = userEtnaInfos.lastName;
          createOptions.network = UserNetwork.ETNA;
        } catch (error) {
          console.warn('Failed to get user infos from ETNA', error);
        }
      }

      const createdUser = await this.createPendingUser(createOptions);
      userId = createdUser.id;
    } else {
      userId = existsResponse.id;
    }
    // Send event
    await this.eventStore.store({
      aggregateId: userId,
      aggregateType: 'user',
      eventType: 'otp-validated',
      createdAt: new Date(),
      payload: { email, otp },
    });
    // Send token
    const token = await this.authService.createToken({
      id: userId,
      email,
    });
    if (!bypassOtp) {
      await this.usersRepository.deleteOTP(email);
    }
    return token;
  }

  private async createPendingUser(options: CreatePendingUserOptions) {
    const user = new PendingUser();
    user.create(options);
    const createdUser = await this.usersRepository.createPendingUser(user);
    await this.eventStore.store({
      aggregateId: createdUser.id,
      aggregateType: 'user',
      eventType: 'user-created',
      createdAt: new Date(),
      payload: { email: options.email },
    });
    return createdUser;
  }

  private async sendOTP(
    options: FindUserByEmailOptions,
    validateOptions = true,
  ) {
    if (validateOptions) {
      findUserByEmailOptionsSchema.parse(options);
    }
    const otp = await this.authService.createOTP(options.email);
    await this.mailsManager.sendOTPEmail(options.email, otp);
    await this.eventStore.store({
      aggregateId: options.email,
      aggregateType: 'user',
      eventType: 'otp-sent',
      createdAt: new Date(),
      payload: { email: options.email },
    });
  }

  async getUserById(id: Id) {
    const user = await this.usersRepository.getUserById({
      id,
      includePending: true,
    });
    return user;
  }
}
