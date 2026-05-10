import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send, ChevronUp, WifiOff } from 'lucide-react';
import { motion } from 'motion/react';
import { useAdminChatMobile } from '../../hooks/useChat';
import { useAuthStore } from '../../stores/authStore';

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-white border border-ink-100 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-ink-400"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const {
    messages, msgMeta, connected, loadingMsgs, isOtherTyping,
    openConversation, leaveConversation, send, sendTyping, sendStopTyping, loadOlderMessages,
  } = useAdminChatMobile();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);
  const lastMsgId = messages[messages.length - 1]?.id;

  useEffect(() => {
    if (id) openConversation(id);
    return () => leaveConversation();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lastMsgId, isOtherTyping]);

  const handleTypingInput = useCallback((value: string) => {
    setInput(value);
    if (!value.trim()) { sendStopTyping(); isTypingRef.current = false; return; }
    if (!isTypingRef.current) { isTypingRef.current = true; sendTyping(); }
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      isTypingRef.current = false;
      sendStopTyping();
    }, 2000);
  }, [sendTyping, sendStopTyping]);

  function handleSend() {
    const text = input.trim();
    if (!text || !connected) return;
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    isTypingRef.current = false;
    send(text);
    setInput('');
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  const hasOlder = msgMeta.total > messages.length;

  return (
    <div className="max-w-107.5 mx-auto flex flex-col min-h-dvh bg-white">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 border-b border-ink-100 flex items-center gap-3">
        <button
          onClick={() => navigate('/admin-chat')}
          className="p-1.5 rounded-lg text-ink-600 hover:bg-ink-100 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <p className="text-sm font-bold text-ink-900">Conversación</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            {connected
              ? <><div className="w-1.5 h-1.5 rounded-full bg-green-500" /><p className="text-xs text-green-600">En línea</p></>
              : <><WifiOff size={11} className="text-ink-400" /><p className="text-xs text-ink-400">Sin conexión</p></>}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1.5 bg-ink-50">
        {loadingMsgs ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-mishell-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {hasOlder && (
              <button
                onClick={loadOlderMessages}
                className="self-center flex items-center gap-1.5 text-xs text-mishell-600 font-semibold bg-white border border-mishell-200 rounded-full px-4 py-1.5 mb-2"
              >
                <ChevronUp size={13} />
                Ver mensajes anteriores
              </button>
            )}
            {messages.map((msg) => {
              const isMe = msg.senderRole === 'ADMIN' || msg.senderId === user?.id;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 ${isMe
                    ? 'bg-mishell-600 text-white rounded-br-sm'
                    : 'bg-white border border-ink-100 text-ink-900 rounded-bl-sm'}`}>
                    {!isMe && (
                      <p className="text-[10px] font-bold text-mishell-600 mb-1">
                        {msg.sender.firstName} {msg.sender.lastName}
                      </p>
                    )}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-mishell-200' : 'text-ink-400'}`}>
                      {fmtTime(msg.createdAt)}
                      {isMe && <span className="ml-1">{msg.readAt ? '✓✓' : '✓'}</span>}
                    </p>
                  </div>
                </div>
              );
            })}
            {isOtherTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-ink-100 flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => handleTypingInput(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
          placeholder="Escribe tu respuesta..."
          className="flex-1 border border-ink-200 rounded-2xl px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-mishell-600 resize-none max-h-28 overflow-y-auto bg-ink-50"
          onInput={(e) => {
            const t = e.currentTarget;
            t.style.height = 'auto';
            t.style.height = `${Math.min(t.scrollHeight, 112)}px`;
          }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || !connected}
          className="w-10 h-10 rounded-full bg-mishell-600 text-white flex items-center justify-center disabled:opacity-40 active:scale-95 transition-all shrink-0"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
