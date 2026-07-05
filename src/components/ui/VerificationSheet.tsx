import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShieldCheck, Clock, XCircle, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Button } from './Button';
import { verificationService } from '../../services/verification.service';
import { getApiErrorMessage } from '../../utils/error';

const STATUS_STYLES: Record<string, { color: string; bg: string; border: string; title: string; desc: string }> = {
  UNVERIFIED: {
    color: 'text-ink-400',
    bg: 'bg-ink-50',
    border: 'border-ink-200',
    title: 'Verifica tu identidad',
    desc: 'Para reservar necesitas verificar tu identidad. Es un proceso único y rápido — nuestro equipo lo revisará.',
  },
  PENDING: {
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    title: 'Solicitud en revisión',
    desc: 'Tu solicitud está siendo revisada. Te avisaremos cuando el administrador la apruebe.',
  },
  APPROVED: {
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    title: '¡Identidad verificada!',
    desc: 'Ya puedes realizar reservas.',
  },
  OBSERVED: {
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    title: 'Solicitud observada',
    desc: 'El administrador tiene una observación. Léela y vuelve a enviarla.',
  },
};

function StatusIcon({ status, className }: { status: string; className?: string }) {
  if (status === 'PENDING')  return <Clock size={24} className={className} />;
  if (status === 'APPROVED') return <CheckCircle2 size={24} className={className} />;
  if (status === 'OBSERVED') return <XCircle size={24} className={className} />;
  return <ShieldCheck size={24} className={className} />;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onApproved?: () => void;
}

export function VerificationSheet({ open, onClose, onApproved }: Props) {
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['verification-status'],
    queryFn: () => verificationService.getMyStatus().then((r) => r.data),
    enabled: open,
    refetchInterval: (query) =>
      query.state.data?.verificationStatus === 'PENDING' ? 5000 : false,
  });

  const submit = useMutation({
    mutationFn: () => verificationService.submit(),
    onSuccess: () => {
      setSubmitError('');
      queryClient.invalidateQueries({ queryKey: ['verification-status'] });
    },
    onError: (err: unknown) => {
      setSubmitError(getApiErrorMessage(err, 'Error al enviar la solicitud. Intenta de nuevo.'));
    },
  });

  useEffect(() => {
    if (!open || !Capacitor.isNativePlatform()) return;
    let handle: { remove: () => void } | undefined;
    CapacitorApp.addListener('backButton', onClose).then((h) => { handle = h; });
    return () => { handle?.remove(); };
  }, [open, onClose]);

  const status = data?.verificationStatus ?? 'UNVERIFIED';
  const cfg = STATUS_STYLES[status] ?? STATUS_STYLES.UNVERIFIED;
  const canSubmit = status === 'UNVERIFIED' || status === 'OBSERVED';

  useEffect(() => {
    if (open && status === 'APPROVED' && onApproved) {
      const t = setTimeout(() => { onClose(); onApproved(); }, 800);
      return () => clearTimeout(t);
    }
  }, [open, status, onApproved, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <motion.div
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="relative bg-white rounded-t-3xl px-5 pt-4 pb-10 flex flex-col gap-4 max-w-107.5 mx-auto w-full max-h-[80dvh] overflow-y-auto"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          >
            {/* Handle */}
            <div className="w-10 h-1 bg-ink-200 rounded-full self-center" />

            {/* Header */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-ink-900">Verificación de identidad</p>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-ink-100 transition-colors shrink-0"
              >
                <X size={16} className="text-ink-500" />
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="w-7 h-7 border-2 border-mishell-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Status card — inline conditional icons to avoid dynamic component identity crash */}
                <div className={`rounded-2xl border p-4 flex flex-col items-center text-center gap-3 ${cfg.bg} ${cfg.border}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${cfg.bg} border-2 ${cfg.border}`}>
                    <StatusIcon status={status} className={cfg.color} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ink-900">{cfg.title}</p>
                    <p className="text-xs text-ink-600 mt-1 leading-relaxed">{cfg.desc}</p>
                  </div>
                </div>

                {/* Observation */}
                {status === 'OBSERVED' && data?.observation && (
                  <div className="bg-white border border-red-200 rounded-2xl p-3 flex gap-2">
                    <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-red-700 mb-0.5">Observación del administrador</p>
                      <p className="text-xs text-ink-800">{data.observation}</p>
                    </div>
                  </div>
                )}

                {status === 'PENDING' && (
                  <div className="flex items-center justify-center gap-2 py-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <p className="text-xs text-ink-400">Actualizando automáticamente…</p>
                  </div>
                )}

                {submitError && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-center">
                    {submitError}
                  </p>
                )}

                {canSubmit && (
                  <Button loading={submit.isPending} onClick={() => submit.mutate()}>
                    {status === 'OBSERVED' ? 'Reenviar solicitud' : 'Enviar solicitud de verificación'}
                  </Button>
                )}

                <button
                  onClick={onClose}
                  className="text-xs text-ink-400 hover:text-ink-600 transition-colors py-1 text-center"
                >
                  Seguir explorando
                </button>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
