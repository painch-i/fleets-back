import { Injectable } from '@nestjs/common';
import { IEventStore } from 'src/domain/_shared/event-store.interface';
import { IEvent } from 'src/domain/_shared/event.interface';
import { PrismaService } from '../persistence/read-database/prisma/prisma.service';

@Injectable()
export class EventStore implements IEventStore {
  constructor(private readonly prismaService: PrismaService) {}
  async store(event: IEvent): Promise<void> {
    await this.prismaService.event.create({
      data: {
        aggregateId: event.aggregateId,
        aggregateType: event.aggregateType,
        createdAt: event.createdAt,
        eventType: event.eventType,
        payload: event.payload,
      },
    });
  }
}
