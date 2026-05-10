import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, CreditCard, Home, Building2, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TabSwitcher } from '../../components/ui/TabSwitcher';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../stores/authStore';

type LoginMethod = 'email' | 'dni';
type LoginMode = 'inquilino' | 'socio';

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [mode, setMode] = useState<LoginMode>('inquilino');
  const [method, setMethod] = useState<LoginMethod>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dni, setDni] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let res;
      if (mode === 'inquilino' && method === 'dni') {
        res = await authService.loginByDni(dni, pin);
      } else {
        res = await authService.login(email, password);
      }
      const { accessToken, user } = res.data;
      setAuth(accessToken, user);
      navigate(user.role === 'ADMIN' ? '/admin-chat' : user.role === 'SOCIO' ? '/socio' : '/home');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 px-5 pt-10 pb-8">
      {/* Logo */}
      <motion.div
        className="flex flex-col items-center mb-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <img
          src="/logo.png"
          alt="Mishell Room"
          className="w-36 h-36 object-contain"
        />
        <p className="text-sm text-ink-600 text-center -mt-1">
          Encuentra tu próxima habitación en Lima
        </p>
      </motion.div>

      {/* Login / Register tabs */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }}>
        <TabSwitcher
          tabs={[{ key: 'login', label: 'Iniciar Sesión' }, { key: 'register', label: 'Registrarse' }]}
          active={tab}
          onChange={(k) => {
            setTab(k as 'login' | 'register');
            if (k === 'register') navigate('/register');
          }}
        />
      </motion.div>

      {/* Mode selector: Inquilino vs Socio */}
      <motion.div
        className="mt-4 flex gap-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {(['inquilino', 'socio'] as LoginMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => { setMode(m); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 transition-all text-sm font-semibold
              ${mode === m
                ? 'border-mishell-600 bg-mishell-50 text-mishell-700'
                : 'border-ink-100 bg-white text-ink-500 hover:border-ink-200'}`}
          >
            {m === 'inquilino'
              ? <Home size={15} className={mode === m ? 'text-mishell-600' : 'text-ink-400'} />
              : <Building2 size={15} className={mode === m ? 'text-mishell-600' : 'text-ink-400'} />
            }
            {m === 'inquilino' ? 'Inquilino' : 'Socio / Propietario'}
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className={`mt-3 px-3 py-2 rounded-xl text-xs text-center font-medium
            ${mode === 'socio' ? 'bg-mishell-50 text-mishell-700' : 'bg-ink-50 text-ink-500'}`}
        >
          {mode === 'socio'
            ? 'Accede como propietario para gestionar tus habitaciones'
            : 'Accede para buscar y reservar habitaciones'}
        </motion.div>
      </AnimatePresence>

      {/* Email / DNI tabs — solo para inquilino */}
      {mode === 'inquilino' && (
        <motion.div className="mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
          <TabSwitcher
            tabs={[{ key: 'email', label: 'Email' }, { key: 'dni', label: 'DNI / Identidad' }]}
            active={method}
            onChange={(k) => { setMethod(k as LoginMethod); setError(''); }}
            dark
          />
        </motion.div>
      )}

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="mt-5 flex flex-col gap-3"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.45 }}
      >
        {mode === 'socio' || method === 'email' ? (
          <>
            <Input
              icon={<Mail size={16} />}
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              icon={<Lock size={16} />}
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <div className="text-right">
              <button type="button" className="text-sm text-mishell-600 font-medium hover:underline">
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </>
        ) : (
          <>
            <Input
              icon={<CreditCard size={16} />}
              type="text"
              placeholder="Número de DNI"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              required
              inputMode="numeric"
              maxLength={12}
            />
            <Input
              icon={<KeyRound size={16} />}
              type="password"
              placeholder="PIN (4–6 dígitos)"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required
              inputMode="numeric"
              maxLength={6}
            />
          </>
        )}

        {error && (
          <motion.p
            className="text-sm text-red-500 text-center"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {error}
          </motion.p>
        )}

        <Button type="submit" loading={loading} className="mt-2">
          {mode === 'socio' ? 'Entrar como Socio' : 'Entrar'}
        </Button>
      </motion.form>

      {/* Footer */}
      <motion.p
        className="mt-auto pt-8 text-xs text-ink-400 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Al continuar, aceptas nuestros{' '}
        <Link to="/terms" className="text-ink-900 underline font-medium">Términos de Servicio</Link>
        {' '}y{' '}
        <Link to="/privacy" className="text-ink-900 underline font-medium">Política de Privacidad</Link>.
      </motion.p>
    </div>
  );
}
