import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

class ValidationError {
  @ApiProperty({ type: String, example: 'invalid_type' })
  code: string;

  @ApiProperty({ type: String, example: 'string' })
  expected: string;

  @ApiProperty({ type: String, example: 'undefined' })
  received: string;

  @ApiProperty({ type: String, example: 'email', isArray: true })
  path: string[];

  @ApiProperty({ type: String, example: 'Required' })
  message: string;
}

export class HttpValidationException extends HttpException {
  @ApiProperty({
    type: [ValidationError],
    isArray: true,
    example: [
      {
        code: 'invalid_type',
        expected: 'string',
        received: 'undefined',
        path: ['email'],
        message: 'Required',
      },
    ],
  })
  errors: ValidationError[];

  @ApiProperty({ type: String, example: 'VALIDATION_ERROR' })
  code: string;

  @ApiProperty({
    type: String,
    example: 'Bad Request: Invalid request parameters',
  })
  message: string;

  constructor(validationError: z.ZodError) {
    super(
      {
        code: 'VALIDATION_ERROR',
        message: 'Bad Request: Invalid request parameters',
        errors: validationError.errors,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
