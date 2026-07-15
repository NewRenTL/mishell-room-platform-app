import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FileText, Download, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppHeader } from '../../components/layout/AppHeader';
import { SignatureCanvas } from '../../components/ui/SignatureCanvas';
import { bookingsService } from '../../services/bookings.service';
import { signaturesService } from '../../services/signatures.service';
import { getApiErrorMessage } from '../../utils/error';

export default function ContractViewPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [signing, setSigning] = useState(false);
  const [signError, setSignError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  const { data: booking, isLoading: loadingBooking, isError: bookingError } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingsService.getOne(bookingId!).then((r) => r.data),
    enabled: !!bookingId,
  });

  const { data: contract, isLoading: loadingContract, isError: contractError } = useQuery({
    queryKey: ['contract', bookingId],
    queryFn: () => bookingsService.getContract(bookingId!).then((r) => r.data),
    enabled: !!bookingId,
  });

  const isSigned = booking?.contract?.status === 'SIGNED' || contract?.status === 'SIGNED';

  async function handleSign() {
    if (!bookingId || !signatureDataUrl) return;
    setSigning(true);
    setSignError('');
    try {
      const sigRes = await signaturesService.upload(signatureDataUrl);
      await bookingsService.signContract(bookingId, sigRes.data.id);
      qc.invalidateQueries({ queryKey: ['booking', bookingId] });
      qc.invalidateQueries({ queryKey: ['contract', bookingId] });
    } catch (err: unknown) {
      setSignError(getApiErrorMessage(err, 'Error al firmar el contrato'));
    } finally {
      setSigning(false);
    }
  }

  async function handleDownload() {
    if (!bookingId || downloading) return;
    setDownloading(true);
    setDownloadError('');
    const newTab = window.open('about:blank', '_blank');
    try {
      const { data } = await bookingsService.getContractDownloadUrl(bookingId);
      const url = data.url;
      if (!url) throw new Error('No se pudo obtener la URL del PDF');
      if (newTab && !newTab.closed) {
        newTab.location.href = url;
      } else {
        window.location.href = url;
      }
    } catch (err: unknown) {
      newTab?.close();
      setDownloadError(getApiErrorMessage(err, 'Error al descargar'));
    } finally {
      setDownloading(false);
    }
  }

  const isLoading = loadingBooking || loadingContract;
  const isError = bookingError || contractError;

  return (
    <div className="flex flex-col min-h-full bg-ink-50">
      <AppHeader title="Contrato de arrendamiento" />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-mishell-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : isError || !contract ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 text-center">
          <p className="text-sm text-ink-400">No se pudo cargar el contrato. Intenta más tarde.</p>
          <button onClick={() => navigate(-1)} className="text-sm font-semibold text-mishell-600">
            Volver
          </button>
        </div>
      ) : (
        <motion.div
          className="px-5 py-5 flex flex-col gap-4 pb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header card */}
          <div className="bg-white rounded-2xl border border-ink-100 p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <FileText size={16} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ink-900">{contract.title}</p>
                <p className="text-xs text-ink-500 mt-0.5">
                  {isSigned ? 'Firmado · ' : 'Pendiente de firma · '}
                  {(contract.issuedAt ?? contract.createdAt)
                    ? new Date(contract.issuedAt ?? contract.createdAt!).toLocaleDateString('es-PE', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })
                    : ''}
                </p>
              </div>
              {isSigned && <CheckCircle2 size={18} className="text-green-600 shrink-0 mt-0.5" />}
            </div>
          </div>

          {/* Contract content */}
          <div
            className="bg-white rounded-2xl border border-ink-100 p-5 text-sm text-ink-900 leading-relaxed max-h-[45vh] overflow-y-auto"
            dangerouslySetInnerHTML={{ __html: contract.content }}
          />

          {/* Sign / Download */}
          <AnimatePresence mode="wait">
            {!isSigned ? (
              <motion.div
                key="sign"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl border border-ink-100 p-4 flex flex-col gap-4"
              >
                <div>
                  <p className="text-sm font-bold text-ink-900 mb-1">Tu firma</p>
                  <p className="text-xs text-ink-500 mb-3">Dibuja tu firma con el dedo y pulsa "Guardar firma"</p>
                  <SignatureCanvas onSave={(dataUrl) => { setSignatureDataUrl(dataUrl); setSignError(''); }} />
                </div>

                {signError && (
                  <p className="text-xs text-mishell-600 text-center">{signError}</p>
                )}

                <motion.button
                  onClick={handleSign}
                  disabled={!signatureDataUrl || signing}
                  className="w-full bg-mishell-600 text-white font-semibold rounded-full h-12 text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  whileTap={{ scale: 0.97 }}
                >
                  {signing
                    ? <><Loader2 size={14} className="animate-spin" /> Firmando...</>
                    : 'Firmar y guardar'
                  }
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="signed"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-3"
              >
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-green-600 shrink-0" />
                  <p className="text-sm font-semibold text-green-800">Contrato firmado exitosamente</p>
                </div>
                <motion.button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold disabled:opacity-60 active:scale-95 transition-all"
                  whileTap={{ scale: 0.97 }}
                >
                  {downloading
                    ? <><Loader2 size={14} className="animate-spin" /> Generando enlace...</>
                    : <><Download size={14} /> Descargar PDF firmado</>
                  }
                </motion.button>
                {downloadError && (
                  <p className="text-xs text-mishell-600 text-center">{downloadError}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => navigate(-1)}
            className="text-sm font-semibold text-ink-500 py-3 text-center hover:text-ink-700 transition-colors"
          >
            Volver
          </button>
        </motion.div>
      )}
    </div>
  );
}
