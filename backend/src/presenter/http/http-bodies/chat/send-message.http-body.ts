import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

const sendMessageHttpBodySchema = z.object({
  content: z.string().max(1000).min(1),
});

export class SendMessageHttpBody
  implements z.infer<typeof sendMessageHttpBodySchema>
{
  @ApiProperty({
    description: 'The content of the message',
    example: 'Hello world!',
  })
  content: string;

  static getSchema = () => sendMessageHttpBodySchema;
}
