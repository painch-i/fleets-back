import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RepositoryErrors } from '../../../domain/_shared/repository.interface';
import { ChatManager } from '../../../domain/chat/chat.manager';
import { Message } from '../../../domain/chat/message.entity';
import { Fleet } from '../../../domain/fleets/entities/fleet.entity';
import { ChatController } from '../chat.controller';

function rawMessageToMessageEntity(rawMessage: any) {
  const messageEntity = new Message();
  Object.assign(messageEntity, rawMessage);
  return messageEntity;
}

class MockChatManager {
  sendMessage = vi.fn();
  getFleetMessages = vi.fn();
}

describe('ChatController', () => {
  let chatController: ChatController;
  let mockChatManager: MockChatManager;

  beforeEach(async () => {
    mockChatManager = new MockChatManager();

    const moduleRef = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        {
          provide: ChatManager,
          useValue: mockChatManager,
        },
      ],
    }).compile();

    chatController = moduleRef.get<ChatController>(ChatController);
  });

  describe('sendFleetMessage', () => {
    it('should send a message successfully', async () => {
      const fleetId = 'fleet-123';
      const userId = 'user-123';
      const body = { content: 'Hello world' };
      const expectedMessage = rawMessageToMessageEntity({
        id: 'message-123',
        fleetId,
        authorId: userId,
        content: body.content,
        createdAt: new Date(),
      });

      mockChatManager.sendMessage.mockResolvedValue(expectedMessage);

      const result = await chatController.sendFleetMessage(
        fleetId,
        userId,
        body,
      );

      expect(mockChatManager.sendMessage).toHaveBeenCalledWith({
        fleetId,
        authorId: userId,
        content: body.content,
      });
      expect(result).toEqual(expectedMessage);
    });

    it('should throw BadRequestException when fleetId is null', async () => {
      const userId = 'user-123';
      const body = { content: 'Hello world' };

      await expect(
        chatController.sendFleetMessage(null, userId, body),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when fleet not found', async () => {
      const fleetId = 'fleet-123';
      const userId = 'user-123';
      const body = { content: 'Hello world' };

      mockChatManager.sendMessage.mockRejectedValue(
        new RepositoryErrors.EntityNotFoundError(Fleet, fleetId),
      );

      await expect(
        chatController.sendFleetMessage(fleetId, userId, body),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getFleetMessages', () => {
    it('should get messages successfully', async () => {
      const fleetId = 'fleet-123';
      const messages = [
        rawMessageToMessageEntity({ id: 'message-1' }),
        rawMessageToMessageEntity({ id: 'message-2' }),
      ];

      mockChatManager.getFleetMessages.mockResolvedValue(messages);

      const result = await chatController.getFleetMessages(fleetId);

      expect(mockChatManager.getFleetMessages).toHaveBeenCalledWith(fleetId);
      expect(result).toEqual(messages);
    });

    it('should throw BadRequestException when fleetId is null', async () => {
      await expect(chatController.getFleetMessages(null)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException when fleet not found', async () => {
      const fleetId = 'fleet-123';

      mockChatManager.getFleetMessages.mockRejectedValue(
        new RepositoryErrors.EntityNotFoundError(Fleet, fleetId),
      );

      await expect(chatController.getFleetMessages(fleetId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
