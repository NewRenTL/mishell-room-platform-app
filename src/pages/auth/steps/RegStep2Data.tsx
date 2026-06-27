import { useRef, useState } from 'react';
import { User, Phone, Mail, Lock, CreditCard, Camera, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { LegalModal } from '../../../components/ui/LegalModal';
import type { LegalType } from '../../../components/ui/LegalModal';
import type { RegRole } from '../../../types/auth';

const PHONE_RE = /^9\d{8}$/;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const MAX_SIZE = 5 * 1024 * 1024;

interface Props {
  role: RegRole;
  firstName: string; onFirstName: (v: string) => void;
  lastName: string;  onLastName:  (v: string) => void;
  phone: string;     onPhone:     (v: string) => void;
  email: string;     onEmail:     (v: string) => void;
  password: string;  onPassword:  (v: string) => void;
  dni: string;       onDni:       (v: string) => void;
  photoFront: File | null; onPhotoFront: (f: File | null) => void;
  photoBack:  File | null; onPhotoBack:  (f: File | null) => void;
  loading: boolean;
  error: string;
  onSubmit: () => void;
}

function PhotoUpload({
  label, file, onFile, error, onError,
}: {
  label: string; file: File | null;
  onFile: (f: File | null) => void;
  error: string; onError: (e: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className={`w-full flex flex-col items-center gap-2 border-2 border-dashed rounded-2xl py-4 transition-colors ${
          file ? 'border-mishell-400 bg-mishell-50' : 'border-ink-200 bg-white hover:border-ink-300'
        }`}
      >
        {file ? (
          <>
            <CheckCircle2 size={22} className="text-mishell-600" />
            <p className="text-sm font-medium text-mishell-700">Foto cargada</p>
            <span className="text-xs text-ink-500 underline">Cambiar foto</span>
          </>
        ) : (
          <>
            <Camera size={22} className="text-ink-400" />
            <p className="text-sm font-medium text-ink-700">{label}</p>
            <p className="text-xs text-ink-400 text-center px-4">JPG, PNG o PDF · Ayuda al admin a verificar tu identidad</p>
          </>
        )}
      </button>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      <input
        ref={ref}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          if (!ALLOWED_TYPES.includes(f.type)) { onError('Solo se aceptan imágenes (JPG, PNG, WEBP) o PDF'); onFile(null); return; }
          if (f.size > MAX_SIZE) { onError('La foto no puede superar 5 MB'); onFile(null); return; }
          onError(''); onFile(f);
        }}
      />
    </div>
  );
}

export default function RegStep2Data({
  role,
  firstName, onFirstName,
  lastName,  onLastName,
  phone,     onPhone,
  email,     onEmail,
  password,  onPassword,
  dni,       onDni,
  photoFront, onPhotoFront,
  photoBack,  onPhotoBack,
  loading, error, onSubmit,
}: Props) {
  const [phoneError, setPhoneError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [frontError, setFrontError] = useState('');
  const [backError,  setBackError]  = useState('');
  const [legalOpen, setLegalOpen] = useState<LegalType>(null);

  const isInquilino = role === 'INQUILINO';
  const phoneValid = !phone.trim() || PHONE_RE.test(phone.replace(/\s/g, ''));
  const photosOk = !isInquilino || (!!photoFront && !!photoBack);

  function handlePhone(v: string) {
    onPhone(v);
    if (v.trim() && !PHONE_RE.test(v.replace(/\s/g, ''))) setPhoneError('Número inválido (9 dígitos, empieza con 9)');
    else setPhoneError('');
  }

  return (
    <div className="px-5 pt-6 pb-8 flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold text-ink-900">Tus datos</h2>
        <p className="text-sm text-ink-500 mt-1">Completa tu información para crear la cuenta</p>
      </div>

      {/* Personal info */}
      <div className="flex gap-2">
        <Input icon={<User size={16} />} placeholder="Nombre *" value={firstName} onChange={(e) => onFirstName(e.target.value)} required />
        <Input placeholder="Apellido *" value={lastName} onChange={(e) => onLastName(e.target.value)} required />
      </div>
      <div>
        <Input icon={<Phone size={16} />} placeholder="Teléfono (opcional)" value={phone} onChange={(e) => handlePhone(e.target.value)} inputMode="tel" maxLength={9} />
        {phoneError && <p className="mt-1 text-xs text-red-500 pl-1">{phoneError}</p>}
      </div>

      {/* Credentials */}
      <Input icon={<Mail size={16} />} type="email" placeholder="Correo electrónico *" value={email} onChange={(e) => onEmail(e.target.value)} required autoComplete="email" />
      <Input
        icon={<Lock size={16} />}
        type={showPassword ? 'text' : 'password'}
        placeholder="Contraseña *"
        value={password}
        onChange={(e) => onPassword(e.target.value)}
        required
        autoComplete="new-password"
        rightElement={
          <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-ink-400 hover:text-ink-600 transition-colors p-0.5">
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
      />

      {/* DNI + photos — only INQUILINO */}
      {isInquilino ? (
        <>
          <Input icon={<CreditCard size={16} />} placeholder="Número de DNI / Carnet Ext. *" value={dni} onChange={(e) => onDni(e.target.value)} inputMode="numeric" maxLength={12} />
          <div>
            <p className="text-[10px] font-semibold text-ink-500 uppercase tracking-wider mb-2">Foto del documento *</p>
            <div className="flex flex-col gap-3">
              <PhotoUpload label="Subir foto ANVERSO del DNI / Carnet Ext." file={photoFront} onFile={onPhotoFront} error={frontError} onError={setFrontError} />
              <PhotoUpload label="Subir foto REVERSO del DNI / Carnet Ext." file={photoBack}  onFile={onPhotoBack}  error={backError}  onError={setBackError}  />
            </div>
            {!photosOk && (
              <p className="mt-2 text-xs text-red-400 text-center">Las dos fotos del documento son obligatorias para registrarte</p>
            )}
          </div>
        </>
      ) : (
        <div className="bg-mishell-50 border border-mishell-100 rounded-xl px-3 py-2.5 text-xs text-ink-700 leading-relaxed">
          Como <strong>Socio</strong>, podrás gestionar tus propiedades sin subir tu DNI ahora.
        </div>
      )}

      {error && (
        <motion.p className="text-sm text-red-500 text-center" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}>
          {error}
        </motion.p>
      )}

      <Button loading={loading} onClick={onSubmit} disabled={isInquilino && !photosOk} className="mt-1">
        {role === 'SOCIO' ? 'Crear cuenta como Socio' : 'Crear cuenta'}
      </Button>

      <p className="text-xs text-ink-400 text-center pt-1">
        Al continuar, aceptas nuestros{' '}
        <button type="button" onClick={() => setLegalOpen('terms')} className="text-ink-900 underline font-medium">Términos de Servicio</button>
        {' '}y{' '}
        <button type="button" onClick={() => setLegalOpen('privacy')} className="text-ink-900 underline font-medium">Política de Privacidad</button>.
      </p>

      <LegalModal type={legalOpen} onClose={() => setLegalOpen(null)} />
    </div>
  );
}
