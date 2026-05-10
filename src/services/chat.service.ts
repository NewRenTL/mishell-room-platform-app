import api from './api';
import type { ChatConversation, ChatMessage } from '../types';

interface MessagesResponse {
  messages: ChatMessage[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export const chatService = {
  getMyConversation: () =>
    api.get<ChatConversation>('/chat/me'),

  getMyUnread: () =>
    api.get<number>('/chat/me/unread'),

  // Admin
  getAllConversations: (page = 1, limit = 20) =>
    api.get<{ data: ChatConversation[]; meta: { total: number; page: number; limit: number; totalPages: number } }>(
      '/chat/conversations', { params: { page, limit } }
    ),

  getMessages: (conversationId: string, page = 1, limit = 30) =>
    api.get<MessagesResponse>(`/chat/conversations/${conversationId}/messages`, {
      params: { page, limit },
    }),

  markAsRead: (conversationId: string) =>
    api.post(`/chat/conversations/${conversationId}/read`),

  closeConversation: (conversationId: string) =>
    api.patch(`/chat/conversations/${conversationId}/close`),
};
