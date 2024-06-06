import { z } from 'zod';
import { GenderConstraintCreationConfigEnum } from '../fleets.types';

export const genderConstraintConfigSchema = z.nativeEnum(
  GenderConstraintCreationConfigEnum,
);
