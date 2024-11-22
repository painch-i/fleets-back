import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EventStore } from '../../../infrastructure/events/event-store.service';
import { MessagesRepository } from '../../../infrastructure/repositories/messages.repository';
import { EventGateway } from '../../../presenter/event/event.gateway';
import { ChatManager } from '../chat.manager';
import { Message } from '../message.entity';

describe('ChatManager', () => {
  let chatManager: ChatManager;
  let mockMessagesRepository: {
    persistMessage: ReturnType<typeof vi.fn>;
    getFleetMessages: ReturnType<typeof vi.fn>;
  };
  let mockEventStore: {
    store: ReturnType<typeof vi.fn>;
  };
  let mockEventGateway: {
    broadcastToFleet: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockMessagesRepository = {
      persistMessage: vi.fn(),
      getFleetMessages: vi.fn(),
    };

    mockEventStore = {
      store: vi.fn(),
    };

    mockEventGateway = {
      broadcastToFleet: vi.fn(),
    };

    chatManager = new ChatManager(
      mockMessagesRepository as unknown as MessagesRepository,
      mockEventStore as unknown as EventStore,
      mockEventGateway as unknown as EventGateway,
    );
  });

  describe('sendMessage', () => {
    it('should send a message successfully', async () => {
      const messageOptions = {
        fleetId: 'fleet-123',
        authorId: 'user-123',
        content: 'Hello world',
      };

      const persistedMessage = new Message();
      Object.assign(persistedMessage, {
        id: 'message-123',
        ...messageOptions,
        createdAt: new Date(),
      });

      mockMessagesRepository.persistMessage.mockResolvedValue(persistedMessage);

      const result = await chatManager.sendMessage(messageOptions);

      expect(mockMessagesRepository.persistMessage).toHaveBeenCalled();
      expect(mockEventStore.store).toHaveBeenCalledWith({
        aggregateId: persistedMessage.id,
        aggregateType: 'message',
        eventType: 'message-sent',
        createdAt: expect.any(Date),
        payload: persistedMessage,
      });
      expect(mockEventGateway.broadcastToFleet).toHaveBeenCalledWith(
        messageOptions.fleetId,
        {
          type: 'message-received',
          payload: persistedMessage,
        },
      );
      expect(result).toEqual(persistedMessage);
    });

    it('should handle errors when sending message', async () => {
      const messageOptions = {
        fleetId: 'fleet-123',
        authorId: 'user-123',
        content: 'Hello world',
      };

      const error = new Error('Database error');
      mockMessagesRepository.persistMessage.mockRejectedValue(error);

      await expect(chatManager.sendMessage(messageOptions)).rejects.toThrow(
        error,
      );
    });
  });

  describe('getFleetMessages', () => {
    it('should get fleet messages successfully', async () => {
      const fleetId = 'fleet-123';
      const messages = [
        Object.assign(new Message(), { id: 'message-1' }),
        Object.assign(new Message(), { id: 'message-2' }),
      ];

      mockMessagesRepository.getFleetMessages.mockResolvedValue(messages);

      const result = await chatManager.getFleetMessages(fleetId);

      expect(mockMessagesRepository.getFleetMessages).toHaveBeenCalledWith(
        fleetId,
      );
      expect(result).toEqual(messages);
    });

    it('should handle errors when getting fleet messages', async () => {
      const fleetId = 'fleet-123';
      const error = new Error('Database error');

      mockMessagesRepository.getFleetMessages.mockRejectedValue(error);

      await expect(chatManager.getFleetMessages(fleetId)).rejects.toThrow(
        error,
      );
    });
  });
});
