import { z } from 'zod';
import { MIN_USER_AGE } from '../../../config/config-variables';
import { GenderEnum } from '../entities/user.types';
import { findUserByIdOptionsSchema } from './find-by-id-options.schema';

const isDateBeforeNYearsAgo = (dateString: string) => {
  const timeStamp = Date.parse(dateString);
  if (isNaN(timeStamp)) return false;
  const date = new Date(dateString);
  const currentYear = new Date().getFullYear();
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(currentYear - MIN_USER_AGE);

  return date <= eighteenYearsAgo;
};

export const completeRegistrationPayloadSchema = z.object({
  firstName: z.string().min(1).openapi({
    description: 'The first name of the user',
    example: 'John',
  }),
  lastName: z.string().min(1).openapi({
    description: 'The last name of the user',
    example: 'Doe',
  }),
  birthDate: z
    .string()
    .refine(isDateBeforeNYearsAgo, {
      message: `User must be at least ${MIN_USER_AGE} years old`,
    })
    .transform((value) => new Date(value))
    .openapi({
      description: 'The birth date of the user',
      type: 'string',
      format: 'date',
    }),
  gender: z.nativeEnum(GenderEnum),
});

export const completeRegistrationOptionsSchema =
  completeRegistrationPayloadSchema.and(findUserByIdOptionsSchema);
