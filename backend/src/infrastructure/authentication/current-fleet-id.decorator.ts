import {
  ExecutionContext,
  HttpException,
  createParamDecorator,
} from '@nestjs/common';
import { Request } from 'express';
import get from 'lodash.get';

type CurrentFleetIdOptions = {
  path?: string;
};

export const CurrentFleetId = createParamDecorator(
  async (options: CurrentFleetIdOptions | undefined, ctx: ExecutionContext) => {
    switch (ctx.getType()) {
      case 'http':
        return getFleetIdFromHttpRequest(
          ctx.switchToHttp().getRequest<Request>(),
          options,
        );
      case 'ws':
        return null;
      default:
        return null;
    }
  },
);

async function getFleetIdFromHttpRequest(
  request: Request,
  options?: CurrentFleetIdOptions,
): Promise<string | null> {
  const fleetId = getFleetIdFromPath(
    request.params,
    options?.path ?? 'fleetId',
  );
  if (fleetId === null) {
    throw new HttpException('Fleet not found', 404);
  }
  return fleetId;
}

function getFleetIdFromPath(data: any, path: string): string | null {
  const value = get(data, path);
  if (typeof value === 'string') {
    return value;
  }
  return null;
}
