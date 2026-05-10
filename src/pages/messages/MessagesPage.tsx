import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, ChevronUp, WifiOff, HeadphonesIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useChat } from '../../hooks/useChat';
import { useAuthStore } from '../../stores/authStore';
import { TypingIndicator } from '../../components/ui/TypingIndicator';
import { fmtTime, fmtDate, groupByDate } from '../../utils/formatChat';

export default function MessagesPage() {
  const user = useAuthStore((s) => s.user);
  const { messages, msgMeta, connected, loading, loadingOlder, loadOlderMessages, send, sendTyping, sendStopTyping, isOtherTyping } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastMsgId = messages[messages.length - 1]?.id;
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lastMsgId]);

  function handleSend() {
    const text = input.trim();
    if (!text || !connected) return;
    send(text);
    setInput('');
    textareaRef.current?.focus();
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  const grouped = groupByDate(messages);
  const hasOlder = msgMeta.total > messages.length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 border-b border-ink-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-mishell-100 flex items-center justify-center shrink-0">
            <HeadphonesIcon size={18} className="text-mishell-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-ink-900">Soporte Mishell Room</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {connected
                ? <><div className="w-1.5 h-1.5 rounded-full bg-green-500" /><p className="text-xs text-green-600">En línea</p></>
                : <><WifiOff size={11} className="text-ink-400" /><p className="text-xs text-ink-400">Sin conexión</p></>}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1 bg-ink-50">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-mishell-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {hasOlder && (
              <button
                onClick={loadOlderMessages}
                disabled={loadingOlder}
                className="self-center flex items-center gap-1.5 text-xs text-mishell-600 font-semibold bg-white border border-mishell-200 rounded-full px-4 py-1.5 mb-2 hover:bg-mishell-50 transition-colors"
              >
                <ChevronUp size={13} />
                {loadingOlder ? 'Cargando...' : 'Ver mensajes anteriores'}
              </button>
            )}

            {messages.length === 0 && (
              <motion.div
                className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-16 h-16 rounded-full bg-white border border-ink-100 flex items-center justify-center">
                  <HeadphonesIcon size={28} className="text-mishell-400" />
                </div>
                <p className="text-sm font-semibold text-ink-900">¡Hola, {user?.firstName}!</p>
                <p className="text-xs text-ink-500 leading-relaxed">
                  Escríbenos cualquier consulta. El equipo de soporte te responderá pronto.
                </p>
              </motion.div>
            )}

            {Object.entries(grouped).map(([dateKey, msgs]) => (
              <div key={dateKey}>
                <div className="flex items-center gap-3 my-3">
                  <div className="flex-1 h-px bg-ink-200" />
                  <span className="text-[10px] font-semibold text-ink-400 uppercase tracking-wide">
                    {fmtDate(msgs[0].createdAt)}
                  </span>
                  <div className="flex-1 h-px bg-ink-200" />
                </div>
                <div className="flex flex-col gap-1.5">
                  {msgs.map((msg) => {
                    const isMe = msg.senderId === user?.id;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 ${isMe
                          ? 'bg-mishell-600 text-white rounded-br-sm'
                          : 'bg-white border border-ink-100 text-ink-900 rounded-bl-sm'}`}>
                          {!isMe && <p className="text-[10px] font-bold text-mishell-600 mb-1">Soporte</p>}
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                          <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-mishell-200' : 'text-ink-400'}`}>
                            {fmtTime(msg.createdAt)}
                            {isMe && <span className="ml-1">{msg.readAt ? '✓✓' : '✓'}</span>}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {isOtherTyping && <TypingIndicator label="Soporte" />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-ink-100 flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => handleTypingInput(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
          placeholder="Escribe tu mensaje..."
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
          className="w-10 h-10 rounded-full bg-mishell-600 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all shrink-0"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
