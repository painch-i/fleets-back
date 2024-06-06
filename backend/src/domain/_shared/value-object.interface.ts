import { z } from 'zod';

export abstract class ValueObject<T extends z.ZodSchema> {
  private readonly value: z.infer<T>;
  constructor(value: z.infer<T>) {
    const schema = this.getSchema();
    schema.parse(value);
    this.value = value;
  }
  abstract getSchema(): T;

  getValue() {
    return this.value;
  }

  parse(value: any): T {
    return this.getSchema().parse(value);
  }
}
