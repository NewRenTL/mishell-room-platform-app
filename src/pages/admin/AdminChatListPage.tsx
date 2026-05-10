import { useNavigate } from 'react-router-dom';
import { MessageCircle, ChevronRight, RefreshCw, WifiOff } from 'lucide-react';
import { motion } from 'motion/react';
import { useAdminChatMobile } from '../../hooks/useChat';

function fmtTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  if (diffDays === 1) return 'Ayer';
  return d.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' });
}

function roleLabel(role: string) {
  if (role === 'SOCIO') return 'Socio';
  if (role === 'INQUILINO') return 'Inquilino';
  return role;
}

function roleBg(role: string) {
  if (role === 'SOCIO') return 'bg-violet-100 text-violet-700';
  if (role === 'INQUILINO') return 'bg-mishell-100 text-mishell-700';
  return 'bg-ink-100 text-ink-600';
}

export default function AdminChatListPage() {
  const navigate = useNavigate();
  const { conversations, convMeta, connected, loadingConvs, loadMore, refresh } = useAdminChatMobile();

  return (
    <div className="max-w-[430px] mx-auto min-h-dvh bg-white flex flex-col">
      {/* Header */}
      <div className="px-4 pt-10 pb-4 border-b border-ink-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-ink-900">Chats de soporte</h1>
            <div className="flex items-center gap-1.5 mt-1">
              {connected
                ? <><div className="w-1.5 h-1.5 rounded-full bg-green-500" /><p className="text-xs text-green-600">Conectado</p></>
                : <><WifiOff size={11} className="text-ink-400" /><p className="text-xs text-ink-400">Sin conexión</p></>}
            </div>
          </div>
          <button onClick={refresh} className="p-2 rounded-xl text-ink-400 hover:text-ink-700 hover:bg-ink-100 transition-colors">
            <RefreshCw size={16} className={loadingConvs ? 'animate-spin' : ''} />
          </button>
        </div>
        {convMeta.total > 0 && (
          <p className="text-xs text-ink-500 mt-1">{convMeta.total} conversaciones activas</p>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loadingConvs && conversations.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-mishell-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-8">
            <div className="w-16 h-16 rounded-full bg-ink-50 flex items-center justify-center">
              <MessageCircle size={28} className="text-ink-300" />
            </div>
            <p className="text-sm font-semibold text-ink-600">Sin conversaciones activas</p>
            <p className="text-xs text-ink-400">Cuando los usuarios escriban, aparecerán aquí.</p>
          </div>
        ) : (
          <>
            {conversations.map((conv, i) => {
              const name = `${conv.user.firstName} ${conv.user.lastName}`;
              return (
                <motion.button
                  key={conv.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => navigate(`/admin-chat/${conv.id}`)}
                  className="w-full text-left px-4 py-4 border-b border-ink-100 flex items-center gap-3 hover:bg-ink-50 active:bg-ink-100 transition-colors"
                >
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full bg-mishell-100 flex items-center justify-center shrink-0 relative">
                    <span className="text-mishell-700 font-bold text-base">{name.charAt(0).toUpperCase()}</span>
                    {(conv.unreadCount ?? 0) > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-ink-900 truncate">{name}</p>
                      {conv.lastMessage && (
                        <span className="text-[11px] text-ink-400 shrink-0">{fmtTime(conv.lastMessage.createdAt)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${roleBg(conv.user.role)}`}>
                        {roleLabel(conv.user.role)}
                      </span>
                    </div>
                    {conv.lastMessage && (
                      <p className="text-xs text-ink-500 truncate mt-0.5">
                        {conv.lastMessage.senderRole === 'ADMIN' ? 'Tú: ' : ''}{conv.lastMessage.content}
                      </p>
                    )}
                  </div>

                  <ChevronRight size={15} className="text-ink-300 shrink-0" />
                </motion.button>
              );
            })}

            {convMeta.page < convMeta.totalPages && (
              <button
                onClick={loadMore}
                disabled={loadingConvs}
                className="w-full py-4 text-sm text-mishell-600 font-semibold hover:bg-mishell-50 transition-colors"
              >
                {loadingConvs ? 'Cargando...' : `Ver más (${convMeta.total - conversations.length} restantes)`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
