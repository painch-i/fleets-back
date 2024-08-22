import {
  extendZodWithOpenApi,
  OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi';
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { Request } from 'express';
import * as fs from 'fs';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { z, ZodTypeAny } from 'zod';
import { GenderConstraintEnum } from './domain/fleets/fleets.types';
import { GenderEnum } from './domain/users/entities/user.types';
export function getFileBuffer(path: string) {
  return fs.readFileSync(path);
}

export function getTokenFromRequest(request: Request): string | null {
  const authorizationHeader = request.headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authorizationHeader.split('Bearer ')[1];
  return token;
}

export function getTokenFromWsClient(client: Socket): string | null {
  const token = client.handshake.auth.token;
  if (!token) {
    return null;
  }
  return token;
}

export function isUserMeetingConstraints(
  constraint: GenderConstraintEnum,
  userGender: GenderEnum,
) {
  const genderValue = userGender;
  if (constraint === GenderConstraintEnum.NO_CONSTRAINT) {
    return true;
  }
  if (constraint === GenderConstraintEnum.FEMALE_ONLY) {
    return genderValue === GenderEnum.FEMALE;
  }
  if (constraint === GenderConstraintEnum.MALE_ONLY) {
    return genderValue === GenderEnum.MALE;
  }
}

export function generateId(): string {
  return uuidv4();
}

/**
 * Arrondit la date donnée à la minute la plus proche en réinitialisant les secondes et les millisecondes à zéro.
 * @param date - La date à arrondir.
 * @returns La date arrondie à la minute la plus proche.
 */
export function roundToMinutes(date: Date) {
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

export function assertIsNotNull<T>(
  value: T | null | undefined,
  message: string,
): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
}

extendZodWithOpenApi(z);
export function generateOpenApiSchema<T extends ZodTypeAny>(
  schema: T,
): SchemaObject | ReferenceObject {
  const generator = new OpenApiGeneratorV3([schema.openapi('generated')]);
  const { components } = generator.generateComponents();
  if (!components || !components.schemas) {
    throw new Error('No schemas found');
  }
  return components.schemas.generated as SchemaObject | ReferenceObject;
}
