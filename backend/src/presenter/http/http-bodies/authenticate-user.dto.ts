import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';
import { Email } from '../../../domain/users/value-objects/email.value-object';

export const authenticateUserDtoSchema = z.object({
  email: Email.getSchema(),
  password: z.string(),
});

export class HttpBodyDto {}
export class AuthenticateUserDto
  extends HttpBodyDto
  implements z.infer<typeof authenticateUserDtoSchema>
{
  @ApiProperty({ type: 'string', format: 'email' })
  email: string;

  @ApiProperty({ type: 'string', format: 'password' })
  password: string;

  static schema = authenticateUserDtoSchema;
}
