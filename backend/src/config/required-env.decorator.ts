import { ZodSchema } from 'zod';

type RequiredEnvVariableOptions = {
  schema: ZodSchema;
  key: string;
};

export const requiredEnv: RequiredEnvVariableOptions[] = [];

export function RequiredEnv(
  ...requiredEnvVariables: RequiredEnvVariableOptions[]
) {
  requiredEnv.push(...requiredEnvVariables);
  return function <T extends { new (...args: any[]) }>(constructor: T) {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args);
      }
    };
  };
}
