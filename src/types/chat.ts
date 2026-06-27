import type { Role } from './user';

export interface ChatSender {
  id: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  sender: ChatSender;
  senderRole: string;
  content: string;
  readAt: string | null;
  createdAt: string;
}

export interface ChatConversation {
  id: string;
  userId: string;
  user: ChatSender & { email: string };
  status: 'OPEN' | 'CLOSED';
  messages?: ChatMessage[];
  lastMessage?: ChatMessage | null;
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
}
