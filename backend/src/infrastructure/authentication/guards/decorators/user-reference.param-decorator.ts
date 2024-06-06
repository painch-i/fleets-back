import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Socket } from 'socket.io';
import { UserReference } from '../../../../domain/users/value-objects/user-reference.value-object';
import { decodeToken } from '../../auth.service';

const validationFunctions = new Map<
  string,
  (payload: Socket | Request) => UserReference | null
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

export const UserFromRequest = createParamDecorator(
  async (data: unknown, context: ExecutionContext) => {
    const validationFunction = validationFunctions.get(context.getType());
    const payload = payloadFunctionNames
      .get(context.getType())
      ?.reduce((acc, fnName) => acc[fnName](), context);
    if (!validationFunction) {
      return null;
    }
    try {
      return await validationFunction(payload);
    } catch (error) {
      return null;
    }
  },
);

function validateHttpRequest(request: Request): UserReference | null {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }
  try {
    const authPayload = decodeToken(token);
    return new UserReference({
      id: authPayload.id,
    });
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

function validateWsClient(client: Socket): UserReference | null {
  throw new Error('Function not implemented.');
}
