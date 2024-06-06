import { Injectable } from '@nestjs/common';
import { EventBridge } from 'aws-sdk'; // Assurez-vous d'installer aws-sdk via npm
import { PutRuleRequest, PutTargetsRequest } from 'aws-sdk/clients/eventbridge';
import { z } from 'zod';
import { ConfigService } from '../../config/config.service';
import { RequiredEnv } from '../../config/required-env.decorator';
import {
  ITaskScheduler,
  Task,
} from '../../domain/fleets/interfaces/task-scheduler.interface';

const TARGET_ARN =
  'arn:aws:events:eu-central-1:723058584332:api-destination/Fleets_back-end/7c8a8de0-5ab9-4a8d-9f58-000d57c532ad';
const ROLE_ARN =
  'arn:aws:iam::723058584332:role/service-role/Amazon_EventBridge_Invoke_Api_Destination_1287393808';

@RequiredEnv(
  {
    key: 'AWS_SECRET_ACCESS_KEY',
    schema: z.string(),
  },
  {
    key: 'AWS_ACCESS_KEY_ID',
    schema: z.string(),
  },
)
@Injectable()
export class EventBridgeTaskScheduler implements ITaskScheduler {
  private readonly eventBridge: AWS.EventBridge;

  constructor(private readonly configService: ConfigService) {
    this.eventBridge = new EventBridge({
      region: 'eu-central-1',
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    });
  }

  async deleteScheduledTask(task: Task): Promise<void> {
    let ruleName = '';
    if (task.type === 'start-gathering') {
      ruleName = `ScheduleGathering_${task.fleetId}`;
    } else {
      ruleName = `ScheduleDeparture_${task.fleetId}`;
    }
    await this.eventBridge.deleteRule({ Name: ruleName }).promise();
  }

  async scheduleGathering(fleetId: string, gatheringTime: Date): Promise<void> {
    const ruleName = `ScheduleGathering_${fleetId}`;
    const ruleParams: PutRuleRequest = {
      Name: ruleName,
      ScheduleExpression: `cron(${this.getCronExpression(gatheringTime)})`,
      State: 'ENABLED', // Activer la règle
      Description: `Schedule gathering for fleet ${fleetId}`,
      EventBusName: 'default', // Vous pouvez modifier le nom du bus d'événements si nécessaire
    };

    // Créer la règle de planification du rassemblement
    await this.eventBridge.putRule(ruleParams).promise();
    const task: Task = {
      type: 'start-gathering',
      fleetId,
    };
    // Ajouter la cible à la règle de planification
    const targetParams: PutTargetsRequest = {
      Rule: ruleName,
      Targets: [
        {
          Arn: TARGET_ARN,
          Id: '1',
          Input: JSON.stringify(task),
          RoleArn: ROLE_ARN, // Ajout du rôle ARN requis
        },
      ],
    };
    await this.eventBridge.putTargets(targetParams).promise();
  }

  async scheduleDeparture(fleetId: string, departureTime: Date): Promise<void> {
    const ruleName = `ScheduleDeparture_${fleetId}`;
    const ruleParams: PutRuleRequest = {
      Name: ruleName,
      ScheduleExpression: `cron(${this.getCronExpression(departureTime)})`,
      State: 'ENABLED', // Activer la règle
      Description: `Schedule departure for fleet ${fleetId}`,
      EventBusName: 'default', // Vous pouvez modifier le nom du bus d'événements si nécessaire
    };

    // Créer la règle de planification du départ
    await this.eventBridge.putRule(ruleParams).promise();
    const task: Task = {
      type: 'start-trip',
      fleetId,
    };
    // Ajouter la cible à la règle de planification
    const targetParams: PutTargetsRequest = {
      Rule: ruleName,
      Targets: [
        {
          Arn: TARGET_ARN,
          Id: '1',
          Input: JSON.stringify(task),
          RoleArn: ROLE_ARN, // Ajout du rôle ARN requis
        },
      ],
    };
    await this.eventBridge.putTargets(targetParams).promise();
  }

  private getCronExpression(date: Date): string {
    const minutes = date.getUTCMinutes();
    const hour = date.getUTCHours();
    const dayOfMonth = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    return `${minutes} ${hour} ${dayOfMonth} ${month} ? ${year}`;
  }
}
