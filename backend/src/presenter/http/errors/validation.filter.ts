import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ZodError } from 'zod';
import { ValidationError } from '../../../domain/_shared/errors/validation.error';

@Catch(ZodError, ValidationError)
export class ValidationFilter implements ExceptionFilter {
  private logger = new Logger(ValidationFilter.name);

  catch(exception: ZodError | ValidationError, host: ArgumentsHost) {
    if (host.getType() !== 'http') {
      this.logger.error(exception, exception.stack);
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

@Catch(PrismaClientKnownRequestError)
export class RowNotFoundFilter implements ExceptionFilter {
  private logger = new Logger(RowNotFoundFilter.name);

  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    if (host.getType() !== 'http') {
      this.logger.error(exception, exception.stack);
      throw exception;
    }
    if (exception.code !== 'P2025') {
      throw exception;
    }
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Bad Request',
      error: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
