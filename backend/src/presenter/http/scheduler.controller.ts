import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiAcceptedResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { z } from 'zod';
import { ConfigService } from '../../config/config.service';
import { RequiredEnv } from '../../config/required-env.decorator';
import { FleetsManager } from '../../domain/fleets/fleets.manager';
import { Task } from '../../domain/fleets/interfaces/task-scheduler.interface';

@RequiredEnv({
  key: 'SCHEDULER_API_KEY',
  schema: z.string(),
})
@Controller('scheduler')
@ApiTags('scheduler')
export class SchedulerController {
  constructor(
    private readonly configService: ConfigService,
    private readonly fleetsManager: FleetsManager,
  ) {}

  @Post('run-due-task')
  @ApiAcceptedResponse({
    description: 'The task was accepted and will be processed',
  })
  @HttpCode(HttpStatus.ACCEPTED)
  async sendFleetMessage(
    @Headers('api-key') apiKey: string | null,
    @Body()
    task: Task,
    @Res() res: Response,
  ) {
    if (apiKey !== this.configService.get('SCHEDULER_API_KEY')) {
      throw new UnauthorizedException('Invalid API key');
    }
    res.sendStatus(HttpStatus.ACCEPTED);
    switch (task.type) {
      case 'start-gathering':
        await this.fleetsManager.startFleetGathering(task.fleetId);
        break;
      case 'start-trip':
        await this.fleetsManager.startFleetTrip(task.fleetId);
        break;
    }
  }
}
