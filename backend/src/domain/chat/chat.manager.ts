import { Inject, Injectable } from '@nestjs/common';
import { MessagesRepository } from '../../infrastructure/repositories/messages.repository';
import { EventGateway } from '../../presenter/event/event.gateway';
import { IEventGateway } from '../_shared/event-gateway.interface';
import { FleetId } from '../fleets/entities/fleet.entity';
import { SendMessageOptions } from './chat.types';
import { Message } from './message.entity';
import { IMessagesRepository } from './messages-repository.interface';
import { IEventStore } from '../_shared/event-store.interface';
import { EventStore } from '../../infrastructure/events/event-store.service';

@Injectable()
export class ChatManager {
  constructor(
    @Inject(MessagesRepository)
    private readonly messagesRepository: IMessagesRepository,
    @Inject(EventStore)
    private readonly eventStore: IEventStore,

    @Inject(EventGateway)
    private readonly eventGateway: IEventGateway,
  ) {}
  async sendMessage(options: SendMessageOptions) {
    const message = new Message();
    message.send(options);
    const persistedMessage =
      await this.messagesRepository.persistMessage(message);
    await this.eventStore.store({
      aggregateId: persistedMessage.id,
      aggregateType: 'message',
      eventType: 'message-sent',
      createdAt: new Date(),
      payload: persistedMessage,
    });
    this.eventGateway.broadcastToFleet(persistedMessage.fleetId, {
      type: 'message-received',
      payload: persistedMessage,
    });
    return persistedMessage;
  }

  async getFleetMessages(fleetId: FleetId) {
    return await this.messagesRepository.getFleetMessages(fleetId);
  }
}
