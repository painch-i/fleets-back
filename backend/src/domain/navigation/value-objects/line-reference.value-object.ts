import { z } from 'zod';
import { ValueObject } from '../../_shared/value-object.interface';

const schema = z.object({
  id: z.string().uuid(),
});
export class LineReference extends ValueObject<typeof schema> {
  getId() {
    return this.getValue().id;
  }
  static getSchema() {
    return schema;
  }
  getSchema() {
    return schema;
  }
}
