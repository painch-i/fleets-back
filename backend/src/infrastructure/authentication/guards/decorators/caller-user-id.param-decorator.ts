import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Socket } from 'socket.io';
import { UserId } from '../../../../domain/users/entities/user.types';
import { decodeToken } from '../../auth.service';

const validationFunctions = new Map<
  string,
  (payload: Socket | Request) => UserId | null
>([
  ['http', validateHttpRequest],
  ['ws', validateWsClient],
  // ['rpc', validateRpcContext],
]);

const payloadFunctionNames = new Map<string, string[]>([
  ['http', ['switchToHttp', 'getRequest']],
  ['ws', ['switchToWs', 'getClient']],
  // ['rpc', 'context'],
]);

type Options = {
  required?: boolean;
};

export const CallerUserId = createParamDecorator(
  async (data: Options, context: ExecutionContext) => {
    const userId = await validate(context);
    if (!userId && data.required) {
      throw new UnauthorizedException('Unauthorized');
    }
    return userId;
  },
);

async function validate(context: ExecutionContext) {
  const validationFunction = validationFunctions.get(context.getType());
  const payload = payloadFunctionNames
    .get(context.getType())
    ?.reduce((acc, fnName) => acc[fnName](), context);
  if (!validationFunction) {
    return null;
  }
  try {
    return validationFunction(payload);
  } catch (error) {
    return null;
  }
}

function validateHttpRequest(request: Request): UserId | null {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }
  try {
    const authPayload = decodeToken(token);
    return authPayload.id;
  } catch (error) {
    return null;
  }
}

function getTokenFromRequest(request: Request): string | null {
  const header = request.headers.authorization;
  if (!header) {
    return null;
  }
  const [bearer, token] = header.split(' ');
  if (bearer !== 'Bearer' || !token) {
    return null;
  }
  return token;
}

function validateWsClient(): UserId | null {
  throw new Error('Function not implemented.');
}
