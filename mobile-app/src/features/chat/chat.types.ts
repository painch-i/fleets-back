export type DryMessage = {
  id: string;
  fleetId: string;
  content: string;
  authorId: string;
  createdAt: Date;
};

export type HydratedMessageOptions = {
  status: 'sent' | 'pending' | 'error';
  isMine: boolean;
};

export type Message = HydratedMessageOptions & DryMessage;

export interface IMessagesContext {
  messages: Message[];
  sendMessage: (message: string) => void;
  isLoading: boolean;
}

export interface SendMessageBody {
  content: string;
}
