import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../../../components/ui/Button';
import { SignatureCanvas } from '../../../components/ui/SignatureCanvas';
import { bookingsService } from '../../../services/bookings.service';
import { signaturesService } from '../../../services/signatures.service';
import { useBookingStore } from '../../../stores/bookingStore';

interface Props {
  bookingId: string;
  hasContract: boolean;
  onNext: () => void;
  onSkip: () => void;
}

export default function Step2Contract({ bookingId, hasContract, onNext, onSkip }: Props) {
  const setSignature = useBookingStore((s) => s.setSignature);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [signed, setSigned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { data: contract, isLoading } = useQuery({
    queryKey: ['booking-contract', bookingId],
    queryFn: () => bookingsService.getContract(bookingId).then((r) => r.data),
    enabled: hasContract && !!bookingId,
  });

  if (!hasContract) {
    return (
      <div className="px-5 py-10 flex flex-col items-center gap-4 text-center">
        <FileText size={48} className="text-ink-300" />
        <p className="text-sm text-ink-600">Esta propiedad no tiene contrato configurado.</p>
        <Button onClick={onSkip}>Continuar sin contrato</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-mishell-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  async function handleSign() {
    if (!signatureDataUrl) { setError('Dibuja tu firma antes de continuar'); return; }
    setError('');
    setLoading(true);
    try {
      const sigRes = await signaturesService.upload(signatureDataUrl);
      const signatureId = sigRes.data.id;
      await bookingsService.signContract(bookingId, signatureId);
      setSignature(signatureDataUrl, signatureId);
      setSigned(true);
      setTimeout(onNext, 800);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Error al firmar el contrato');
    } finally {
      setLoading(false);
    }
  }

  if (signed) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-16 gap-3"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <CheckCircle size={56} className="text-mishell-600" />
        <p className="text-base font-semibold text-ink-900">¡Contrato firmado!</p>
      </motion.div>
    );
  }

  const issuedDate = contract?.issuedAt ?? contract?.createdAt;

  return (
    <motion.div
      className="flex flex-col gap-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Contract document viewer */}
      <div className="mx-5 mt-5 bg-white border border-ink-100 rounded-2xl overflow-hidden shadow-sm">
        {/* Document header */}
        <div className="px-5 pt-4 pb-3 border-b border-ink-100">
          <p className="text-[9px] font-bold tracking-widest text-mishell-600 uppercase mb-1.5">Contrato Digital</p>
          <h3 className="text-sm font-bold text-ink-900 leading-snug">
            {contract?.title ?? 'Contrato de Arrendamiento'}
          </h3>
          {issuedDate && (
            <p className="text-[11px] text-ink-400 mt-1">
              Emitido el {new Date(issuedDate).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}
        </div>
        {/* Document content — plain text with preserved line breaks */}
        <div className="px-5 py-4 max-h-72 overflow-y-auto">
          <pre className="text-[11px] text-ink-800 leading-relaxed whitespace-pre-wrap font-sans wrap-break-word">
            {contract?.content}
          </pre>
        </div>
      </div>

      {/* Signature */}
      <motion.div
        className="px-5"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h2 className="text-sm font-bold text-ink-900 mb-2">Tu firma</h2>
        <SignatureCanvas onSave={(dataUrl) => setSignatureDataUrl(dataUrl)} />
      </motion.div>

      {error && (
        <motion.p
          className="text-sm text-mishell-600 text-center px-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}

      <div className="px-5 pb-6">
        <Button loading={loading} onClick={handleSign} disabled={!signatureDataUrl}>
          Firmar y continuar
        </Button>
      </div>
    </motion.div>
  );
}
