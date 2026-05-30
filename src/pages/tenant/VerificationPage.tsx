import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShieldCheck, Clock, XCircle, CheckCircle2, AlertCircle, IdCard, Phone, User } from 'lucide-react';
import { motion } from 'motion/react';
import { AppHeader } from '../../components/layout/AppHeader';
import { Button } from '../../components/ui/Button';
import { DniDocViewer } from '../../components/ui/DniDocViewer';
import { verificationService } from '../../services/verification.service';

const STATUS_CONFIG = {
  UNVERIFIED: {
    icon: ShieldCheck,
    color: 'text-ink-400',
    bg: 'bg-ink-50',
    border: 'border-ink-200',
    title: 'Verifica tu identidad',
    desc: 'Para poder realizar reservas necesitas verificar tu identidad. El proceso es rápido y nuestro equipo revisará tu información.',
  },
  PENDING: {
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    title: 'Solicitud en revisión',
    desc: 'Tu solicitud está siendo revisada por nuestro equipo. Te notificaremos pronto.',
  },
  APPROVED: {
    icon: CheckCircle2,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    title: '¡Identidad verificada!',
    desc: 'Tu identidad ha sido verificada. Ya puedes realizar reservas en la plataforma.',
  },
  OBSERVED: {
    icon: XCircle,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    title: 'Solicitud observada',
    desc: 'El administrador revisó tu solicitud y tiene una observación. Lee el comentario y vuelve a enviarla.',
  },
};

export default function VerificationPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['verification-status'],
    queryFn: () => verificationService.getMyStatus().then((r) => {
      const d = (r.data as any).data ?? r.data;
      return d as import('../../services/verification.service').VerificationStatus;
    }),
  });

  const submit = useMutation({
    mutationFn: () => verificationService.submit(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['verification-status'] }),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-dvh bg-ink-50">
        <AppHeader title="Verificación de identidad" />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-mishell-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const status = data?.verificationStatus ?? 'UNVERIFIED';
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  const canSubmit = status === 'UNVERIFIED' || status === 'OBSERVED';

  return (
    <div className="flex flex-col min-h-dvh bg-ink-50">
      <AppHeader title="Verificación de identidad" />

      <div className="px-5 py-6 flex flex-col gap-4">

        {/* Status card */}
        <motion.div
          className={`rounded-2xl border p-5 flex flex-col items-center text-center gap-3 ${cfg.bg} ${cfg.border}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${cfg.bg} border-2 ${cfg.border}`}>
            <Icon size={28} className={cfg.color} />
          </div>
          <div>
            <p className="text-base font-bold text-ink-900">{cfg.title}</p>
            <p className="text-sm text-ink-600 mt-1 leading-relaxed">{cfg.desc}</p>
          </div>
        </motion.div>

        {/* Observation from admin */}
        {status === 'OBSERVED' && data?.observation && (
          <div className="bg-white border border-red-200 rounded-2xl p-4 flex gap-3">
            <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-red-700 mb-1">Observación del administrador</p>
              <p className="text-sm text-ink-800">{data.observation}</p>
            </div>
          </div>
        )}

        {/* User data summary */}
        {data?.user && (
          <div className="bg-white border border-ink-100 rounded-2xl p-4 flex flex-col gap-3">
            <p className="text-xs font-bold text-ink-500 uppercase tracking-wide">Tus datos a verificar</p>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-mishell-100 flex items-center justify-center">
                <User size={14} className="text-mishell-600" />
              </div>
              <div>
                <p className="text-xs text-ink-500">Nombre completo</p>
                <p className="text-sm font-semibold text-ink-900">{data.user.firstName} {data.user.lastName}</p>
              </div>
            </div>

            {data.user.dni && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-mishell-100 flex items-center justify-center">
                  <IdCard size={14} className="text-mishell-600" />
                </div>
                <div>
                  <p className="text-xs text-ink-500">DNI</p>
                  <p className="text-sm font-semibold text-ink-900">{data.user.dni}</p>
                </div>
              </div>
            )}

            {data.user.phone && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-mishell-100 flex items-center justify-center">
                  <Phone size={14} className="text-mishell-600" />
                </div>
                <div>
                  <p className="text-xs text-ink-500">Teléfono</p>
                  <p className="text-sm font-semibold text-ink-900">{data.user.phone}</p>
                </div>
              </div>
            )}

            {data.user.dniPhotoUrl && (
              <div>
                <p className="text-xs text-ink-500 mb-2">Documento de DNI adjunto</p>
                <DniDocViewer url={data.user.dniPhotoUrl} />
              </div>
            )}
          </div>
        )}

        {/* Submit button */}
        {canSubmit && (
          <Button
            loading={submit.isPending}
            onClick={() => submit.mutate()}
          >
            {status === 'OBSERVED' ? 'Reenviar solicitud' : 'Enviar solicitud de verificación'}
          </Button>
        )}

        {status === 'PENDING' && data?.requestedAt && (
          <p className="text-xs text-ink-400 text-center">
            Enviada el {new Date(data.requestedAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
        )}
      </div>
    </div>
  );
}
