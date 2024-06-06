import { $Enums } from '@prisma/client';
import { z } from 'zod';
import { ValueObject } from '../../_shared/value-object.interface';

export enum GenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

type TGender = `${GenderEnum}`;

const schema = z.nativeEnum(GenderEnum);

export class Gender extends ValueObject<typeof schema> {
  constructor(value: TGender) {
    super(GenderEnum[value]);
  }

  getSchema() {
    return schema;
  }

  static getSchema() {
    return schema;
  }

  static fromDatabase(databaseGender: $Enums.Gender) {
    switch (databaseGender) {
      case 'MALE':
        return new Gender('MALE');
      case 'FEMALE':
        return new Gender('FEMALE');
    }
  }
}
