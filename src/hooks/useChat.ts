import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../stores/authStore';
import { chatService } from '../services/chat.service';
import type { ChatConversation, ChatMessage } from '../types';

const SOCKET_URL = (import.meta.env.VITE_API_URL as string || 'http://localhost:3000').replace(/\/api$/, '');

export function useChat() {
  const { accessToken } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);
  const convIdRef = useRef<string | null>(null);

  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [msgMeta, setMsgMeta] = useState({ total: 0, page: 1, limit: 30, totalPages: 1 });
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [isOtherTyping, setIsOtherTyping] = useState(false);

  // Load initial conversation + last 30 messages via REST
  useEffect(() => {
    if (!accessToken) return;
    setLoading(true);
    chatService.getMyConversation()
      .then((r) => {
        const conv = r.data;
        setConversation(conv);
        convIdRef.current = conv.id;
        const msgs = conv.messages ?? [];
        setMessages(msgs);
        setMsgMeta((m) => ({ ...m, total: msgs.length }));
        chatService.markAsRead(conv.id).catch(() => {});
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  // Socket connection (only after conversation is loaded)
  useEffect(() => {
    if (!accessToken || !conversation?.id) return;
    const convId = conversation.id;

    const socket = io(`${SOCKET_URL}/chat`, {
      auth: { token: accessToken },
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('chat:join', { conversationId: convId });
      socket.emit('chat:read', { conversationId: convId });
    });

    socket.on('disconnect', () => setConnected(false));

    socket.on('chat:message', (message: ChatMessage) => {
      if (message.conversationId !== convIdRef.current) return;
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
      // Auto-mark as read when actively in chat
      socket.emit('chat:read', { conversationId: convIdRef.current });
    });

    socket.on('chat:typing', (data: { conversationId: string }) => {
      if (data.conversationId === convIdRef.current) setIsOtherTyping(true);
    });

    socket.on('chat:stop_typing', (data: { conversationId: string }) => {
      if (data.conversationId === convIdRef.current) setIsOtherTyping(false);
    });

    socket.on('chat:read', () => {
      setMessages((prev) =>
        prev.map((m) => (m.readAt ? m : { ...m, readAt: new Date().toISOString() }))
      );
    });

    return () => { socket.disconnect(); };
  }, [accessToken, conversation?.id]);

  const loadOlderMessages = useCallback(async () => {
    const convId = convIdRef.current;
    if (!convId || loadingOlder) return;
    const nextPage = msgMeta.page + 1;
    if (nextPage > msgMeta.totalPages && msgMeta.total > 0) return;
    setLoadingOlder(true);
    try {
      const r = await chatService.getMessages(convId, nextPage, 30);
      setMessages((prev) => [...r.data.messages, ...prev]);
      setMsgMeta(r.data.meta);
    } finally {
      setLoadingOlder(false);
    }
  }, [msgMeta, loadingOlder]);

  const send = useCallback((content: string) => {
    if (!socketRef.current || !convIdRef.current || !content.trim()) return;
    socketRef.current.emit('chat:stop_typing', { conversationId: convIdRef.current });
    socketRef.current.emit('chat:send', { conversationId: convIdRef.current, content: content.trim() });
  }, []);

  const sendTyping = useCallback(() => {
    if (!socketRef.current || !convIdRef.current) return;
    socketRef.current.emit('chat:typing', { conversationId: convIdRef.current });
  }, []);

  const sendStopTyping = useCallback(() => {
    if (!socketRef.current || !convIdRef.current) return;
    socketRef.current.emit('chat:stop_typing', { conversationId: convIdRef.current });
  }, []);

  return { conversation, messages, msgMeta, connected, loading, loadingOlder, loadOlderMessages, send, sendTyping, sendStopTyping, isOtherTyping };
}

// ─── Admin version (for mishell-room admin view) ─────────────────────────────

export function useAdminChatMobile() {
  const { accessToken } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);
  const selectedRef = useRef<string | null>(null);

  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [convMeta, setConvMeta] = useState({ total: 0, page: 1, limit: 20, totalPages: 1 });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [msgMeta, setMsgMeta] = useState({ total: 0, page: 1, limit: 30, totalPages: 1 });
  const [connected, setConnected] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [isOtherTyping, setIsOtherTyping] = useState(false);

  const loadConversations = useCallback(async (page = 1) => {
    setLoadingConvs(true);
    try {
      const r = await chatService.getAllConversations(page, 20);
      const { data, meta } = r.data;
      setConversations((prev) => (page === 1 ? data : [...prev, ...data]));
      setConvMeta(meta);
    } finally {
      setLoadingConvs(false);
    }
  }, []);

  useEffect(() => { loadConversations(1); }, [loadConversations]);

  const openConversation = useCallback(async (id: string) => {
    selectedRef.current = id;
    setMessages([]);
    setLoadingMsgs(true);
    try {
      const r = await chatService.getMessages(id, 1, 30);
      setMessages(r.data.messages);
      setMsgMeta(r.data.meta);
      socketRef.current?.emit('chat:join', { conversationId: id });
      socketRef.current?.emit('chat:read', { conversationId: id });
      setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c)));
      chatService.markAsRead(id).catch(() => {});
    } finally {
      setLoadingMsgs(false);
    }
  }, []);

  const leaveConversation = useCallback(() => {
    if (selectedRef.current) {
      socketRef.current?.emit('chat:leave', { conversationId: selectedRef.current });
    }
    selectedRef.current = null;
    setMessages([]);
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    const socket = io(`${SOCKET_URL}/chat`, {
      auth: { token: accessToken },
      transports: ['websocket'],
    });
    socketRef.current = socket;
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('chat:typing', (data: { conversationId: string }) => {
      if (data.conversationId === selectedRef.current) setIsOtherTyping(true);
    });

    socket.on('chat:stop_typing', (data: { conversationId: string }) => {
      if (data.conversationId === selectedRef.current) setIsOtherTyping(false);
    });

    socket.on('chat:message', (message: ChatMessage) => {
      if (message.conversationId === selectedRef.current) {
        setIsOtherTyping(false);
        setMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) return prev;
          return [...prev, message];
        });
        socket.emit('chat:read', { conversationId: message.conversationId });
      }
      setConversations((prev) => {
        const exists = prev.find((c) => c.id === message.conversationId);
        if (!exists) { loadConversations(1); return prev; }
        return [...prev.map((c) => {
          if (c.id !== message.conversationId) return c;
          return {
            ...c, lastMessage: message, updatedAt: message.createdAt,
            unreadCount: message.conversationId === selectedRef.current ? 0 : (c.unreadCount ?? 0) + 1,
          };
        })].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      });
    });

    return () => { socket.disconnect(); };
  }, [accessToken, loadConversations]);

  const send = useCallback((content: string) => {
    if (!socketRef.current || !selectedRef.current || !content.trim()) return;
    socketRef.current.emit('chat:stop_typing', { conversationId: selectedRef.current });
    socketRef.current.emit('chat:send', { conversationId: selectedRef.current, content: content.trim() });
  }, []);

  const sendTyping = useCallback(() => {
    if (!socketRef.current || !selectedRef.current) return;
    socketRef.current.emit('chat:typing', { conversationId: selectedRef.current });
  }, []);

  const sendStopTyping = useCallback(() => {
    if (!socketRef.current || !selectedRef.current) return;
    socketRef.current.emit('chat:stop_typing', { conversationId: selectedRef.current });
  }, []);

  const loadMore = useCallback(() => {
    if (convMeta.page < convMeta.totalPages) loadConversations(convMeta.page + 1);
  }, [convMeta, loadConversations]);

  const loadOlderMessages = useCallback(async () => {
    const id = selectedRef.current;
    if (!id || msgMeta.page >= msgMeta.totalPages) return;
    const r = await chatService.getMessages(id, msgMeta.page + 1, 30);
    setMessages((prev) => [...r.data.messages, ...prev]);
    setMsgMeta(r.data.meta);
  }, [msgMeta]);

  return {
    conversations, convMeta, messages, msgMeta, connected,
    loadingConvs, loadingMsgs, isOtherTyping,
    openConversation, leaveConversation, send, sendTyping, sendStopTyping, loadMore, loadOlderMessages,
    refresh: () => loadConversations(1),
  };
}
