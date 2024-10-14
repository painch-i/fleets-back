import { FLEET_MOCKED } from '@/__mocks__/fleet';

import { DryMessage, Message } from '@/features/chat/chat.types';

export const DRY_MESSAGE_MOCKED: DryMessage = {
  id: '63d56b62-2c6e-4b88-b7e6-3ebe5cc82451',
  fleetId: FLEET_MOCKED.id,
  authorId: '07a6138c-c191-4918-b268-77465dda30a3',
  content: 'Fake message',
  createdAt: new Date('2024-03-07T15:46:47.670Z'),
};

export const MESSAGE_MOCKED: Message = {
  ...DRY_MESSAGE_MOCKED,
  status: 'sent',
  isMine: true,
};
