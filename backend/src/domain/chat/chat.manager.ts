import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventStore } from '../../infrastructure/events/event-store.service';
import { MessagesRepository } from '../../infrastructure/repositories/messages.repository';
import { EventGateway } from '../../presenter/event/event.gateway';
import { IEventGateway } from '../_shared/event-gateway.interface';
import { IEventStore } from '../_shared/event-store.interface';
import { FleetId } from '../fleets/entities/fleet.entity';
import { SendMessageOptions } from './chat.types';
import { Message } from './message.entity';
import { IMessagesRepository } from './messages-repository.interface';

@Injectable()
export class ChatManager {
  private readonly logger = new Logger(ChatManager.name);

  constructor(
    @Inject(MessagesRepository)
    private readonly messagesRepository: IMessagesRepository,
    @Inject(EventStore)
    private readonly eventStore: IEventStore,
    @Inject(EventGateway)
    private readonly eventGateway: IEventGateway,
  ) {}

  async sendMessage(options: SendMessageOptions) {
    this.logger.log(
      `Start sending message from user ID: ${options.authorId} to fleet ID: ${options.fleetId}`,
    );

    try {
      // Create and send the message
      const message = new Message();
      message.send(options);
      this.logger.verbose(`Message created: ${JSON.stringify(message)}`);

      // Persist the message
      const persistedMessage =
        await this.messagesRepository.persistMessage(message);
      this.logger.log(`Message persisted with ID: ${persistedMessage.id}`);

      // Store the message event in the event store
      this.logger.verbose('Storing message-sent event in the event store...');
      await this.eventStore.store({
        aggregateId: persistedMessage.id,
        aggregateType: 'message',
        eventType: 'message-sent',
        createdAt: new Date(),
        payload: persistedMessage,
      });
      this.logger.debug('Message-sent event stored successfully.');

      // Broadcasting the message to the fleet
      this.logger.verbose(
        `Broadcasting message to fleet ID: ${persistedMessage.fleetId}`,
      );
      this.eventGateway.broadcastToFleet(persistedMessage.fleetId, {
        type: 'message-received',
        payload: persistedMessage,
      });
      this.logger.log('Message broadcasted successfully.');

      return persistedMessage;
    } catch (error) {
      this.logger.error(
        `Failed to send message: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getFleetMessages(fleetId: FleetId) {
    this.logger.verbose(`Fetching messages for fleet ID: ${fleetId}`);
    try {
      const messages = await this.messagesRepository.getFleetMessages(fleetId);
      this.logger.debug(
        `Fetched ${messages.length} messages for fleet ID: ${fleetId}`,
      );
      return messages;
    } catch (error) {
      this.logger.error(
        `Failed to fetch messages for fleet ID: ${fleetId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
