import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, CreditCard, Camera, KeyRound, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TabSwitcher } from '../../components/ui/TabSwitcher';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AppHeader } from '../../components/layout/AppHeader';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../stores/authStore';
import { getApiErrorMessage } from '../../utils/error';

type RegisterMethod = 'email' | 'dni';

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [tab, setTab] = useState<'login' | 'register'>('register');
  const [method, setMethod] = useState<RegisterMethod>('email');
  const [asSocio, setAsSocio] = useState(false);

  // Email form
  const [emailForm, setEmailForm] = useState({
    firstName: '', lastName: '', email: '', password: '', phone: '', dni: '',
  });

  // DNI form
  const [dniForm, setDniForm] = useState({
    firstName: '', lastName: '', dni: '', pin: '', pinConfirm: '', phone: '',
  });
  const [dniPhoto, setDniPhoto] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function setE(key: keyof typeof emailForm, val: string) {
    setEmailForm((f) => ({ ...f, [key]: val }));
  }

  function setD(key: keyof typeof dniForm, val: string) {
    setDniForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (method === 'dni') {
      if (dniForm.pin !== dniForm.pinConfirm) {
        setError('Los PINs no coinciden');
        return;
      }
      if (!/^\d{4,6}$/.test(dniForm.pin)) {
        setError('El PIN debe tener entre 4 y 6 dígitos numéricos');
        return;
      }
    }

    setLoading(true);
    try {
      if (method === 'email') {
        const [firstName, ...rest] = emailForm.firstName.trim().split(' ');
        const lastName = rest.length ? rest.join(' ') : emailForm.lastName.trim();
        const res = await authService.register({
          firstName,
          lastName,
          email: emailForm.email,
          password: emailForm.password,
          phone: emailForm.phone || undefined,
          dni: emailForm.dni || undefined,
          role: asSocio ? 'SOCIO' : 'INQUILINO',
        });
        const { accessToken, user } = res.data;
        setAuth(accessToken, user);
        navigate(user.role === 'SOCIO' ? '/socio' : '/home');
      } else {
        const res = await authService.registerByDni(
          {
            firstName: dniForm.firstName.trim(),
            lastName: dniForm.lastName.trim(),
            dni: dniForm.dni,
            pin: dniForm.pin,
            phone: dniForm.phone || undefined,
          },
          dniPhoto ?? undefined,
        );
        const { accessToken, user } = res.data;
        setAuth(accessToken, user);
        navigate('/home');
      }
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Error al crear la cuenta'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col flex-1">
      <AppHeader onBack={() => navigate('/login')} />

      <div className="flex-1 px-5 pt-4 pb-8 flex flex-col">
        {/* Logo */}
        <motion.div
          className="flex flex-col items-center mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <img src="/logo.png" alt="Mishell Room" className="w-28 h-28 object-contain" />
          <h1 className="text-xl font-bold text-ink-900 -mt-1">Crea tu cuenta</h1>
          <p className="text-sm text-ink-600 text-center mt-1">Únete a la comunidad de roomies más grande</p>
        </motion.div>

        {/* Login / Register switcher */}
        <TabSwitcher
          tabs={[{ key: 'login', label: 'Iniciar Sesión' }, { key: 'register', label: 'Registrarse' }]}
          active={tab}
          onChange={(k) => { setTab(k as 'login' | 'register'); if (k === 'login') navigate('/login'); }}
        />

        {/* Email / DNI switcher */}
        <div className="mt-4">
          <TabSwitcher
            tabs={[{ key: 'email', label: 'Email' }, { key: 'dni', label: 'DNI / Identidad' }]}
            active={method}
            onChange={(k) => { setMethod(k as RegisterMethod); setError(''); setAsSocio(false); }}
            dark
          />
        </div>

        {/* Form */}
        <AnimatePresence mode="wait">
          <motion.form
            key={method}
            onSubmit={handleSubmit}
            className="mt-5 flex flex-col gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {method === 'email' ? (
              <>
                <div className="flex gap-2">
                  <Input
                    icon={<User size={16} />}
                    placeholder="Nombre"
                    value={emailForm.firstName}
                    onChange={(e) => setE('firstName', e.target.value)}
                    required
                  />
                  <Input
                    placeholder="Apellido"
                    value={emailForm.lastName}
                    onChange={(e) => setE('lastName', e.target.value)}
                    required
                  />
                </div>
                <Input
                  icon={<Mail size={16} />}
                  type="email"
                  placeholder="Correo electrónico"
                  value={emailForm.email}
                  onChange={(e) => setE('email', e.target.value)}
                  required
                  autoComplete="email"
                />
                <Input
                  icon={<Lock size={16} />}
                  type="password"
                  placeholder="Contraseña (mín. 8 caracteres)"
                  value={emailForm.password}
                  onChange={(e) => setE('password', e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <Input
                  icon={<Phone size={16} />}
                  placeholder="Teléfono (opcional)"
                  value={emailForm.phone}
                  onChange={(e) => setE('phone', e.target.value)}
                  inputMode="tel"
                />

                {/* Socio toggle */}
                {!asSocio ? (
                  <button
                    type="button"
                    onClick={() => setAsSocio(true)}
                    className="text-sm text-mishell-600 font-semibold underline text-center mt-1"
                  >
                    ¿Quieres registrarte como Socio/Propietario?
                  </button>
                ) : (
                  <div className="flex items-start gap-2 bg-mishell-50 border border-mishell-200 rounded-xl p-3">
                    <CheckCircle2 size={16} className="text-mishell-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-mishell-700 flex-1">
                      Te registrarás como <strong>Socio/Propietario</strong> y podrás publicar habitaciones.{' '}
                      <button type="button" className="text-mishell-600 underline font-semibold" onClick={() => setAsSocio(false)}>
                        Cancelar
                      </button>
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex gap-2">
                  <Input
                    icon={<User size={16} />}
                    placeholder="Nombre"
                    value={dniForm.firstName}
                    onChange={(e) => setD('firstName', e.target.value)}
                    required
                  />
                  <Input
                    placeholder="Apellido"
                    value={dniForm.lastName}
                    onChange={(e) => setD('lastName', e.target.value)}
                    required
                  />
                </div>
                <Input
                  icon={<CreditCard size={16} />}
                  placeholder="Número de DNI"
                  value={dniForm.dni}
                  onChange={(e) => setD('dni', e.target.value)}
                  required
                  inputMode="numeric"
                  maxLength={12}
                />
                <Input
                  icon={<KeyRound size={16} />}
                  type="password"
                  placeholder="PIN de acceso (4–6 dígitos)"
                  value={dniForm.pin}
                  onChange={(e) => setD('pin', e.target.value)}
                  required
                  inputMode="numeric"
                  maxLength={6}
                />
                <Input
                  icon={<KeyRound size={16} />}
                  type="password"
                  placeholder="Confirmar PIN"
                  value={dniForm.pinConfirm}
                  onChange={(e) => setD('pinConfirm', e.target.value)}
                  required
                  inputMode="numeric"
                  maxLength={6}
                />
                <Input
                  icon={<Phone size={16} />}
                  placeholder="Teléfono (opcional)"
                  value={dniForm.phone}
                  onChange={(e) => setD('phone', e.target.value)}
                  inputMode="tel"
                />

                {/* DNI photo upload */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex flex-col items-center gap-2 border-2 border-dashed rounded-xl p-5 transition-colors
                    ${dniPhoto ? 'border-mishell-400 bg-mishell-50' : 'border-ink-200 bg-white hover:border-ink-300'}`}
                >
                  {dniPhoto ? (
                    <>
                      <CheckCircle2 size={28} className="text-mishell-600" />
                      <p className="text-sm font-medium text-mishell-700">Foto cargada</p>
                      <p className="text-xs text-mishell-600 truncate max-w-full px-4">{dniPhoto.name}</p>
                      <span className="text-xs text-ink-500 underline">Cambiar foto</span>
                    </>
                  ) : (
                    <>
                      <Camera size={28} className="text-ink-400" />
                      <p className="text-sm font-medium text-ink-900">Subir foto de DNI</p>
                      <p className="text-xs text-ink-400 text-center">Para verificar tu identidad. Asegúrate de que sea nítida.</p>
                      <span className="text-xs text-mishell-600 font-medium underline">Seleccionar foto (opcional)</span>
                    </>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    if (f.size > 5 * 1024 * 1024) { setError('La foto no puede superar 5 MB'); return; }
                    if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) { setError('Solo se aceptan imágenes JPG, PNG o WEBP'); return; }
                    setError('');
                    setDniPhoto(f);
                  }}
                />

                <p className="text-xs text-ink-400 text-center -mt-1">
                  Tu cuenta quedará pendiente de aprobación por el administrador.
                </p>
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
              {method === 'email' && asSocio ? 'Crear cuenta como Socio' : 'Crear cuenta'}
            </Button>
          </motion.form>
        </AnimatePresence>

        <p className="mt-auto pt-8 text-xs text-ink-400 text-center">
          Al continuar, aceptas nuestros{' '}
          <Link to="/terms" className="text-ink-900 underline font-medium">Términos de Servicio</Link>
          {' '}y{' '}
          <Link to="/privacy" className="text-ink-900 underline font-medium">Política de Privacidad</Link>.
        </p>
      </div>
    </div>
  );
}
