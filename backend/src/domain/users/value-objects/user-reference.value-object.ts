import { z } from 'zod';
import { Id } from '../../../types';
import { ValueObject } from '../../_shared/value-object.interface';

const schema = z.object({
  id: z.string().uuid(),
});
export class UserReference extends ValueObject<typeof schema> {
  constructor({ id }: { id: Id }) {
    super({ id });
  }
  getId(): Id {
    return this.getValue().id;
  }
  static getSchema() {
    return schema;
  }
  getSchema() {
    return schema;
  }
}
