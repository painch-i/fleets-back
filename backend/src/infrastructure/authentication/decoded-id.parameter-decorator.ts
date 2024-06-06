import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import {
  getDecodedFirebaseIdTokenFromHttpRequest,
  getDecodedFirebaseIdTokenFromWsClient,
} from './firebase-jwt.service';

export const DecodedId = createParamDecorator(
  async (_data: unknown, ctx: ExecutionContext) => {
    switch (ctx.getType()) {
      case 'http':
        return await getDecodedFirebaseIdTokenFromHttpRequest(
          ctx.switchToHttp().getRequest(),
        );
      case 'ws':
        return await getDecodedFirebaseIdTokenFromWsClient(
          ctx.switchToWs().getClient(),
        );
      default:
        return null;
    }
  },
);
