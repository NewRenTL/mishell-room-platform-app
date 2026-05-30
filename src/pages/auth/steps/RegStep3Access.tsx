import { useRef, useState } from 'react';
import { Mail, Lock, CreditCard, KeyRound, Camera, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { LegalModal } from '../../../components/ui/LegalModal';
import type { LegalType } from '../../../components/ui/LegalModal';
import type { RegRole, RegMethod } from '../RegisterFlowPage';

interface Props {
  role: RegRole;
  regMethod: RegMethod;
  onRegMethod: (m: RegMethod) => void;
  email: string;
  onEmail: (v: string) => void;
  password: string;
  onPassword: (v: string) => void;
  dni: string;
  onDni: (v: string) => void;
  pin: string;
  onPin: (v: string) => void;
  pinConf: string;
  onPinConf: (v: string) => void;
  photo: File | null;
  onPhoto: (f: File | null) => void;
  loading: boolean;
  error: string;
  onSubmit: () => void;
}

export default function RegStep3Access({
  role, regMethod, onRegMethod,
  email, onEmail, password, onPassword,
  dni, onDni, pin, onPin, pinConf, onPinConf,
  photo, onPhoto,
  loading, error, onSubmit,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [legalOpen,  setLegalOpen]  = useState<LegalType>(null);
  const [fileError,  setFileError]  = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPin,      setShowPin]      = useState(false);
  const [showPinConf,  setShowPinConf]  = useState(false);

  function EyeToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
    return (
      <button type="button" onClick={onToggle} className="text-ink-400 hover:text-ink-600 transition-colors p-0.5">
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    );
  }

  return (
    <div className="px-5 pt-8 pb-6 flex flex-col gap-4">
      {/* Step heading */}
      <div className="mb-1">
        <h2 className="text-xl font-bold text-ink-900">Elige cómo acceder</h2>
        <p className="text-sm text-ink-500 mt-1">Selecciona tu método de inicio de sesión</p>
      </div>

      {/* Method selector */}
      <div className="flex gap-2">
        {(['email', 'dni'] as RegMethod[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onRegMethod(m)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
              regMethod === m
                ? 'border-mishell-600 bg-mishell-50 text-mishell-700'
                : 'border-ink-200 bg-white text-ink-500 hover:border-ink-300'
            }`}
          >
            {m === 'email' ? 'Correo' : 'DNI + PIN'}
          </button>
        ))}
      </div>

      {/* Email fields */}
      {regMethod === 'email' && (
        <>
          <Input
            icon={<Mail size={16} />}
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => onEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            icon={<Lock size={16} />}
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña (mín. 8 caracteres)"
            value={password}
            onChange={(e) => onPassword(e.target.value)}
            required
            autoComplete="new-password"
            rightElement={<EyeToggle show={showPassword} onToggle={() => setShowPassword((v) => !v)} />}
          />
        </>
      )}

      {/* DNI fields */}
      {regMethod === 'dni' && (
        <>
          <Input
            icon={<CreditCard size={16} />}
            placeholder="Número de DNI"
            value={dni}
            onChange={(e) => onDni(e.target.value)}
            required
            inputMode="numeric"
            maxLength={12}
          />
          <Input
            icon={<KeyRound size={16} />}
            type={showPin ? 'text' : 'password'}
            placeholder="PIN de acceso (4–6 dígitos)"
            value={pin}
            onChange={(e) => onPin(e.target.value)}
            required
            inputMode="numeric"
            maxLength={6}
            rightElement={<EyeToggle show={showPin} onToggle={() => setShowPin((v) => !v)} />}
          />
          <Input
            icon={<KeyRound size={16} />}
            type={showPinConf ? 'text' : 'password'}
            placeholder="Confirmar PIN"
            value={pinConf}
            onChange={(e) => onPinConf(e.target.value)}
            required
            inputMode="numeric"
            maxLength={6}
            rightElement={<EyeToggle show={showPinConf} onToggle={() => setShowPinConf((v) => !v)} />}
          />

          {/* DNI photo */}
          <div>
            <p className="text-[10px] font-semibold text-ink-500 uppercase tracking-wider mb-1.5">
              Foto del DNI (opcional)
            </p>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className={`w-full flex flex-col items-center gap-2 border-2 border-dashed rounded-2xl py-4 transition-colors ${
                photo ? 'border-mishell-400 bg-mishell-50' : 'border-ink-200 bg-white hover:border-ink-300'
              }`}
            >
              {photo ? (
                <>
                  <CheckCircle2 size={22} className="text-mishell-600" />
                  <p className="text-sm font-medium text-mishell-700">Foto cargada</p>
                  <span className="text-xs text-ink-500 underline">Cambiar foto</span>
                </>
              ) : (
                <>
                  <Camera size={22} className="text-ink-400" />
                  <p className="text-sm font-medium text-ink-700">Subir foto o escáner del DNI</p>
                  <p className="text-xs text-ink-400 text-center px-4">
                    JPG, PNG o PDF · Ayuda al admin a verificar tu identidad
                  </p>
                </>
              )}
            </button>
            {fileError && <p className="mt-1.5 text-xs text-red-500">{fileError}</p>}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                if (!['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(f.type)) {
                  setFileError('Solo se aceptan imágenes (JPG, PNG, WEBP) o PDF');
                  onPhoto(null);
                  return;
                }
                if (f.size > 5 * 1024 * 1024) {
                  setFileError('La foto no puede superar 5 MB');
                  onPhoto(null);
                  return;
                }
                setFileError('');
                onPhoto(f);
              }}
            />
          </div>

          {role === 'INQUILINO' && (
            <p className="text-xs text-ink-400 text-center -mt-1">
              Podrás ver propiedades. Para reservar, el administrador debe verificar tu cuenta.
            </p>
          )}
        </>
      )}

      {error && (
        <motion.p
          className="text-sm text-red-500 text-center"
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {error}
        </motion.p>
      )}

      <Button loading={loading} onClick={onSubmit} className="mt-1">
        {role === 'SOCIO' ? 'Crear cuenta como Socio' : 'Crear cuenta'}
      </Button>

      <p className="text-xs text-ink-400 text-center pt-1">
        Al continuar, aceptas nuestros{' '}
        <button type="button" onClick={() => setLegalOpen('terms')} className="text-ink-900 underline font-medium">
          Términos de Servicio
        </button>
        {' '}y{' '}
        <button type="button" onClick={() => setLegalOpen('privacy')} className="text-ink-900 underline font-medium">
          Política de Privacidad
        </button>.
      </p>

      <LegalModal type={legalOpen} onClose={() => setLegalOpen(null)} />
    </div>
  );
}
