import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, CreditCard, KeyRound, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { LegalModal } from '../../components/ui/LegalModal';
import type { LegalType } from '../../components/ui/LegalModal';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../stores/authStore';

function detectCredentialType(value: string): 'email' | 'dni' | null {
  if (!value.trim()) return null;
  if (value.includes('@')) return 'email';
  if (/^\d+$/.test(value.trim())) return 'dni';
  return null;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = (location.state as { from?: string } | null)?.from;
  const setAuth  = useAuthStore((s) => s.setAuth);

  const [credential, setCredential] = useState('');
  const [secret,     setSecret]     = useState('');
  const credType = detectCredentialType(credential);

  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [legalOpen, setLegalOpen] = useState<LegalType>(null);
  const [showSecret, setShowSecret] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!credential.trim() || !secret.trim()) {
      setError('Completa todos los campos');
      return;
    }

    if (credType === null) {
      setError('Ingresa un correo electrónico o DNI válido');
      return;
    }

    if (credType === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credential.trim())) {
      setError('Ingresa un correo electrónico válido');
      return;
    }

    if (credType === 'dni' && !/^\d{8}$/.test(credential.trim())) {
      setError('El DNI debe tener exactamente 8 dígitos');
      return;
    }

    setLoading(true);
    try {
      const res = credType === 'dni'
        ? await authService.loginByDni(credential.trim(), secret)
        : await authService.login(credential.trim(), secret);
      const { accessToken, user } = res.data;
      setAuth(accessToken, user);
      const defaultPath = user.role === 'ADMIN' ? '/admin-chat' : user.role === 'SOCIO' ? '/socio' : '/home';
      navigate(fromPath ?? defaultPath, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 px-5 pt-8 pb-8">

      {/* Logo + heading */}
      <motion.div
        className="flex flex-col items-center mb-8"
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <img src="/logo.png" alt="Mishell Room" className="w-36 h-36 object-contain" />
        <span className="mt-2 text-xs font-bold text-mishell-600 uppercase tracking-widest">Iniciar sesión</span>
        <h1 className="text-2xl font-bold text-ink-900 mt-0.5">¡Bienvenidos!</h1>
        <p className="text-sm text-ink-500 text-center mt-1 leading-snug">
          Encuentra tu próxima habitación{'\n'}en Mishell Room
        </p>
      </motion.div>

      {/* Login form */}
      <motion.form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <Input
          icon={credType === 'email' ? <Mail size={16} /> : <CreditCard size={16} />}
          type={credType === 'email' ? 'email' : 'text'}
          inputMode={credType === 'dni' ? 'numeric' : undefined}
          placeholder="DNI o correo electrónico"
          value={credential}
          onChange={(e) => { setCredential(e.target.value); setSecret(''); }}
          autoComplete="username"
        />
        <Input
          icon={credType === 'dni' ? <KeyRound size={16} /> : <Lock size={16} />}
          type={showSecret ? 'text' : 'password'}
          inputMode={credType === 'dni' ? 'numeric' : undefined}
          maxLength={credType === 'dni' ? 6 : undefined}
          placeholder={credType === 'dni' ? 'PIN (4–6 dígitos)' : 'Contraseña'}
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          autoComplete="current-password"
          rightElement={
            <button
              type="button"
              onClick={() => setShowSecret((v) => !v)}
              className="text-ink-400 hover:text-ink-600 transition-colors p-0.5"
              aria-label={showSecret ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />
        {credType === 'dni' && (
          <p className="text-xs text-ink-400 text-center -mt-1">
            Tu PIN fue asignado por el administrador
          </p>
        )}
        {credType === 'email' && (
          <div className="text-right -mt-1">
            <button type="button" className="text-sm text-mishell-600 font-medium hover:underline">
              ¿Olvidaste tu contraseña?
            </button>
          </div>
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

        <Button type="submit" loading={loading} className="mt-1">
          Entrar
        </Button>
      </motion.form>

      {/* Register link */}
      <div className="flex items-center justify-center gap-1 mt-6">
        <span className="text-sm text-ink-500">¿No tienes cuenta?</span>
        <button
          type="button"
          onClick={() => navigate('/register', { state: { from: fromPath } })}
          className="text-sm font-semibold text-mishell-600 hover:underline"
        >
          Regístrate
        </button>
      </div>

      {/* Legal */}
      <p className="mt-auto pt-8 text-xs text-ink-400 text-center">
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
