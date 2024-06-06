import { z } from 'zod';
import { MIN_USER_AGE } from '../../../config/config-variables';
import { GenderEnum } from '../value-objects/gender.value-object';
import { findByIdOptionsSchema } from './find-by-id-options.schema';

const isDateBeforeNYearsAgo = (dateString: string) => {
  const timeStamp = Date.parse(dateString);
  if (isNaN(timeStamp)) return false;
  const date = new Date(dateString);
  const currentYear = new Date().getFullYear();
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(currentYear - MIN_USER_AGE);

  return date <= eighteenYearsAgo;
};

export const completeRegistrationOptionsSchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    birthDate: z
      .string()
      .refine(isDateBeforeNYearsAgo, {
        message: `User must be at least ${MIN_USER_AGE} years old`,
      })
      .transform((value) => new Date(value)),
    gender: z.nativeEnum(GenderEnum),
  })
  .and(findByIdOptionsSchema);
