import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { z } from 'zod';
import { getFileBuffer } from '../utils';
import { RequiredEnv, requiredEnv } from './required-env.decorator';

export enum FleetsEnvironmentEnum {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  PREPROD = 'preprod',
}
export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

@Injectable()
@RequiredEnv({ key: 'FLEETS_ENV', schema: z.nativeEnum(FleetsEnvironmentEnum) })
export class ConfigService {
  private readonly config: Record<string, string>;

  constructor() {
    this.config = process.env as Record<string, string>;
    try {
      const envBuffer = getFileBuffer('.env');
      this.config = {
        ...this.config,
        ...dotenv.parse(envBuffer),
      };
    } catch (error) {
      console.warn('No .env file found');
    }
    this.checkRequiredEnv();
  }

  private checkRequiredEnv() {
    const shape = {};
    for (const { key, schema } of requiredEnv) {
      shape[key] = schema;
    }
    const envSchema = z.object(shape);
    try {
      envSchema.parse(this.config);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ConfigError(
          `Invalid config: ${JSON.stringify(error.errors)}`,
        );
      }
    }
  }
  get(key: 'FLEETS_ENV'): FleetsEnvironmentEnum;
  get<T>(key: string): T;
  get<T>(key: string): T {
    return this.config[key] as T;
  }
}
