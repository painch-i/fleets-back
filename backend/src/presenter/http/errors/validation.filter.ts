import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ZodError } from 'zod';
import { ValidationError } from '../../../domain/_shared/errors/validation.error';

@Catch(ZodError, ValidationError)
export class ValidationFilter implements ExceptionFilter {
  catch(exception: ZodError | ValidationError, host: ArgumentsHost) {
    if (host.getType() !== 'http') {
      throw exception;
    }
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    response.status(400).json({
      statusCode: 400,
      message: 'Bad Request',
      error: exception,
      timestamp: new Date().toISOString(),
    });
  }
}
