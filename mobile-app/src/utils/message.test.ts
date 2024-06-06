import { DRY_MESSAGE_MOCKED, MESSAGE_MOCKED } from '@/__mocks__/message';

import { DryMessage, Message } from '@/features/chat/chat.types';
import { hydrateMessages, hydrateMessage } from '@/utils/message';

describe('Utils | message | hydrateMessage', () => {
  describe('When userId is the same as message.authorId', () => {
    it('should return the correct data with isMine true', () => {
      const initialUserId = '07a6138c-c191-4918-b268-77465dda30a3';

      expect(hydrateMessage(DRY_MESSAGE_MOCKED, initialUserId)).toEqual(
        MESSAGE_MOCKED,
      );
    });
  });

  describe('When userId is not the same as message.authorId', () => {
    it('should return the correct data with isMine false', () => {
      const initialUserId = '';

      const expectedOutput: Message = {
        ...MESSAGE_MOCKED,
        isMine: false,
      };

      expect(hydrateMessage(DRY_MESSAGE_MOCKED, initialUserId)).toEqual(
        expectedOutput,
      );
    });
  });
});

describe('Utils | message | hydrateMessages', () => {
  it('should handle undefined dryMessages Array', () => {
    const initialDryMessagesArray = undefined;
    const initialUserId = '';

    const expectedOutput: Message[] = [];

    expect(hydrateMessages(initialDryMessagesArray, initialUserId)).toEqual(
      expectedOutput,
    );
  });

  it('should handle empty dryMessages Array', () => {
    const initialDryMessagesArray: DryMessage[] = [];
    const initialUserId = '';

    const expectedOutput: Message[] = [];

    expect(hydrateMessages(initialDryMessagesArray, initialUserId)).toEqual(
      expectedOutput,
    );
  });

  it('should return the correct data', () => {
    const initialDryMessagesArray: DryMessage[] = [
      DRY_MESSAGE_MOCKED,
      DRY_MESSAGE_MOCKED,
    ];
    const initialUserId = '07a6138c-c191-4918-b268-77465dda30a3';

    const expectedOutput: Message[] = [MESSAGE_MOCKED, MESSAGE_MOCKED];

    expect(hydrateMessages(initialDryMessagesArray, initialUserId)).toEqual(
      expectedOutput,
    );
  });
});
