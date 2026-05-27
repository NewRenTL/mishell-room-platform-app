import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Mail, Lock, CreditCard, KeyRound,
  User, Phone, Camera, CheckCircle2, X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../stores/authStore';

const LEGAL_CONTENT = {
  terms: {
    title: 'Términos de Servicio',
    sections: [
      {
        heading: '1. Aceptación de los términos',
        body: 'Al acceder y utilizar Mishell Room aceptas quedar vinculado por estos Términos de Servicio. Si no estás de acuerdo con alguna parte de los términos, no podrás acceder al servicio.',
      },
      {
        heading: '2. Descripción del servicio',
        body: 'Mishell Room es una plataforma digital que conecta a propietarios de habitaciones (socios) con personas que buscan alojamiento (inquilinos). Actuamos como intermediarios y no somos parte de los contratos de arrendamiento entre las partes.',
      },
      {
        heading: '3. Registro y cuenta',
        body: 'Para usar el servicio debes crear una cuenta con información veraz y actualizada. Eres responsable de mantener la confidencialidad de tu contraseña o PIN y de todas las actividades que ocurran bajo tu cuenta.',
      },
      {
        heading: '4. Pagos y tarifas',
        body: 'Los pagos se realizan directamente entre inquilinos y propietarios según los términos acordados en cada reserva. Mishell Room puede cobrar comisiones por el uso de la plataforma, las cuales serán comunicadas de forma transparente antes de completar cualquier transacción.',
      },
      {
        heading: '5. Conducta del usuario',
        body: 'Te comprometes a usar la plataforma únicamente para fines legales y de manera que no infrinja los derechos de terceros. Queda prohibido el uso fraudulento, la publicación de información falsa o cualquier actividad que perjudique a otros usuarios.',
      },
      {
        heading: '6. Limitación de responsabilidad',
        body: 'Mishell Room no se hace responsable de daños indirectos, incidentales o consecuentes derivados del uso o la imposibilidad de uso del servicio. Nuestra responsabilidad máxima no excederá el importe pagado por el usuario en los últimos 3 meses.',
      },
      {
        heading: '7. Modificaciones',
        body: 'Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor al publicarse en la plataforma. El uso continuado del servicio tras la publicación implica la aceptación de los nuevos términos.',
      },
      {
        heading: '8. Contacto',
        body: 'Para cualquier consulta sobre estos términos puedes contactarnos a través del chat de soporte dentro de la aplicación o escribirnos a soporte@mishellroom.com.',
      },
    ],
  },
  privacy: {
    title: 'Política de Privacidad',
    sections: [
      {
        heading: '1. Información que recopilamos',
        body: 'Recopilamos información que nos proporcionas al crear tu cuenta (nombre, correo, DNI, teléfono), datos de uso de la plataforma y, en caso de registro con DNI, una fotografía del documento de identidad.',
      },
      {
        heading: '2. Uso de la información',
        body: 'Utilizamos tu información para: gestionar tu cuenta y reservas, procesar pagos, enviarte notificaciones del servicio, mejorar la plataforma y cumplir con obligaciones legales.',
      },
      {
        heading: '3. Compartición de datos',
        body: 'No vendemos tus datos personales a terceros. Compartimos información únicamente con las partes necesarias para la prestación del servicio (propietarios con inquilinos para coordinar reservas) y con proveedores de servicios bajo acuerdos de confidencialidad.',
      },
      {
        heading: '4. Almacenamiento y seguridad',
        body: 'Tus datos se almacenan en servidores seguros con cifrado en tránsito y en reposo. Las contraseñas y PINs se almacenan siempre en formato encriptado y nunca en texto plano.',
      },
      {
        heading: '5. Tus derechos',
        body: 'Tienes derecho a acceder, rectificar o eliminar tu información personal en cualquier momento. Para ejercer estos derechos contacta a nuestro equipo de soporte. Atenderemos tu solicitud en un plazo máximo de 30 días.',
      },
      {
        heading: '6. Cookies',
        body: 'Utilizamos cookies y tecnologías similares para mejorar tu experiencia, analizar el uso del servicio y personalizar el contenido. Puedes controlar las cookies desde la configuración de tu navegador.',
      },
      {
        heading: '7. Menores de edad',
        body: 'Nuestro servicio no está dirigido a menores de 18 años. No recopilamos conscientemente datos de menores. Si detectamos que un usuario es menor de edad, eliminaremos su cuenta y datos de forma inmediata.',
      },
      {
        heading: '8. Contacto',
        body: 'Para consultas sobre privacidad escríbenos a privacidad@mishellroom.com o usa el chat de soporte dentro de la aplicación.',
      },
    ],
  },
};

type LegalType = 'terms' | 'privacy' | null;

function LegalModal({ type, onClose }: { type: LegalType; onClose: () => void }) {
  const content = type ? LEGAL_CONTENT[type] : null;

  return (
    <AnimatePresence>
      {type && content && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Bottom sheet */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white rounded-t-3xl z-50 flex flex-col"
            style={{ maxHeight: '82dvh' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 bg-ink-200 rounded-full" />
            </div>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-ink-100 shrink-0">
              <h2 className="text-base font-bold text-ink-900">{content.title}</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-ink-100 text-ink-500 hover:bg-ink-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            {/* Scrollable content */}
            <div className="overflow-y-auto px-5 py-4 flex flex-col gap-5">
              {content.sections.map((s) => (
                <div key={s.heading}>
                  <p className="text-sm font-semibold text-ink-900 mb-1">{s.heading}</p>
                  <p className="text-sm text-ink-600 leading-relaxed">{s.body}</p>
                </div>
              ))}
              <p className="text-xs text-ink-400 text-center pb-2">
                Última actualización: enero 2025
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

type Tab    = 'login' | 'register';
type Method = 'email' | 'dni';

export default function LoginPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const setAuth   = useAuthStore((s) => s.setAuth);

  const [tab,    setTab]    = useState<Tab>(location.pathname === '/register' ? 'register' : 'login');
  const [method, setMethod] = useState<Method>('email');

  /* ── login fields ── */
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [dni,      setDni]      = useState('');
  const [pin,      setPin]      = useState('');

  /* ── register email fields ── */
  const [rFirstName, setRFirstName] = useState('');
  const [rLastName,  setRLastName]  = useState('');
  const [rEmail,     setREmail]     = useState('');
  const [rPassword,  setRPassword]  = useState('');
  const [rPhone,     setRPhone]     = useState('');
  const [asSocio,    setAsSocio]    = useState(false);

  /* ── register DNI fields ── */
  const [dName,     setDName]     = useState('');
  const [dLastName, setDLastName] = useState('');
  const [dDni,      setDDni]      = useState('');
  const [dPin,      setDPin]      = useState('');
  const [dPinConf,  setDPinConf]  = useState('');
  const [dPhone]    = useState('');
  const [dPhoto,    setDPhoto]    = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [legalOpen, setLegalOpen] = useState<LegalType>(null);

  function switchTab(t: Tab) {
    setTab(t);
    setError('');
    setMethod('email');
    navigate(t === 'login' ? '/login' : '/register', { replace: true });
  }

  function switchMethod(m: Method) {
    setMethod(m);
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (tab === 'register' && method === 'dni') {
      if (dPin !== dPinConf) { setError('Los PINs no coinciden'); return; }
      if (!/^\d{4,6}$/.test(dPin)) { setError('El PIN debe tener entre 4 y 6 dígitos'); return; }
    }

    setLoading(true);
    try {
      if (tab === 'login') {
        const res = method === 'dni'
          ? await authService.loginByDni(dni, pin)
          : await authService.login(email, password);
        const { accessToken, user } = res.data;
        setAuth(accessToken, user);
        navigate(user.role === 'ADMIN' ? '/admin-chat' : user.role === 'SOCIO' ? '/socio' : '/home');

      } else {
        if (method === 'email') {
          const res = await authService.register({
            firstName: rFirstName.trim(),
            lastName:  rLastName.trim(),
            email:     rEmail,
            password:  rPassword,
            phone:     rPhone || undefined,
            role:      asSocio ? 'SOCIO' : 'INQUILINO',
          });
          const { accessToken, user } = res.data;
          setAuth(accessToken, user);
          navigate(user.role === 'SOCIO' ? '/socio' : '/home');
        } else {
          const res = await authService.registerByDni(
            { firstName: dName.trim(), lastName: dLastName.trim(), dni: dDni, pin: dPin, phone: dPhone || undefined },
            dPhoto ?? undefined,
          );
          const { accessToken, user } = res.data;
          setAuth(accessToken, user);
          navigate('/home');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message ?? (tab === 'login' ? 'Credenciales incorrectas' : 'Error al crear la cuenta'));
    } finally {
      setLoading(false);
    }
  }

  const heading  = tab === 'login' ? '¡Bienvenidos!'   : 'Crea tu cuenta';
  const subtitle = tab === 'login'
    ? 'Encuentra tu próxima habitación\nen Mishell Room'
    : 'Únete a la comunidad de roomies\nmás grande';
  const btnLabel = tab === 'login' ? 'Entrar' : (asSocio ? 'Crear cuenta como Socio' : 'Crear cuenta');

  return (
    <div className="flex flex-col flex-1 px-5 pt-8 pb-8">

      {/* Logo + heading */}
      <motion.div
        className="flex flex-col items-center mb-6"
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <img src="/logo.png" alt="Mishell Room" className="w-36 h-36 object-contain" />
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
          >
            <h1 className="text-2xl font-bold text-ink-900 mt-1">{heading}</h1>
            <p className="text-sm text-ink-500 text-center mt-1 leading-snug whitespace-pre-line">{subtitle}</p>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* ── Main toggle: Iniciar Sesión / Registrarse ── */}
      <motion.div
        className="flex bg-ink-100 p-1 rounded-2xl mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        {(['login', 'register'] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => switchTab(t)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              tab === t
                ? 'bg-white text-ink-900 shadow-sm'
                : 'text-ink-500 hover:text-ink-700'
            }`}
          >
            {t === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
        ))}
      </motion.div>

      {/* ── Method toggle: Email / DNI ── */}
      <motion.div
        className="flex gap-2 mb-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.3 }}
      >
        {(['email', 'dni'] as Method[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMethod(m)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
              method === m
                ? 'bg-ink-900 text-white'
                : 'bg-white border border-ink-200 text-ink-500 hover:border-ink-400'
            }`}
          >
            {m === 'email' ? 'Email' : 'DNI / Identidad'}
          </button>
        ))}
      </motion.div>

      {/* ── Form ── */}
      <AnimatePresence mode="wait">
        <motion.form
          key={`${tab}-${method}`}
          onSubmit={handleSubmit}
          className="flex flex-col gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {/* LOGIN — EMAIL */}
          {tab === 'login' && method === 'email' && (
            <>
              <Input icon={<Mail size={16} />} type="email" placeholder="Correo electrónico"
                value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
              <Input icon={<Lock size={16} />} type="password" placeholder="Contraseña"
                value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
              <div className="text-right -mt-1">
                <button type="button" className="text-sm text-mishell-600 font-medium hover:underline">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </>
          )}

          {/* LOGIN — DNI */}
          {tab === 'login' && method === 'dni' && (
            <>
              <Input icon={<CreditCard size={16} />} type="text" placeholder="Número de DNI"
                value={dni} onChange={(e) => setDni(e.target.value)} required inputMode="numeric" maxLength={12} />
              <Input icon={<KeyRound size={16} />} type="password" placeholder="PIN (4–6 dígitos)"
                value={pin} onChange={(e) => setPin(e.target.value)} required inputMode="numeric" maxLength={6} />
              <p className="text-xs text-ink-400 text-center -mt-1">Tu PIN fue asignado por el administrador</p>
            </>
          )}

          {/* REGISTER — EMAIL */}
          {tab === 'register' && method === 'email' && (
            <>
              <div className="flex gap-2">
                <Input icon={<User size={16} />} placeholder="Nombre"
                  value={rFirstName} onChange={(e) => setRFirstName(e.target.value)} required />
                <Input placeholder="Apellido"
                  value={rLastName} onChange={(e) => setRLastName(e.target.value)} required />
              </div>
              <Input icon={<Mail size={16} />} type="email" placeholder="Correo electrónico"
                value={rEmail} onChange={(e) => setREmail(e.target.value)} required autoComplete="email" />
              <Input icon={<Lock size={16} />} type="password" placeholder="Contraseña (mín. 8 caracteres)"
                value={rPassword} onChange={(e) => setRPassword(e.target.value)} required autoComplete="new-password" />
              <Input icon={<Phone size={16} />} placeholder="Teléfono (opcional)"
                value={rPhone} onChange={(e) => setRPhone(e.target.value)} inputMode="tel" />
              {!asSocio ? (
                <button type="button" onClick={() => setAsSocio(true)}
                  className="text-sm text-mishell-600 font-semibold underline text-center">
                  ¿Registrarte como Socio/Propietario?
                </button>
              ) : (
                <div className="flex items-start gap-2 bg-mishell-50 border border-mishell-200 rounded-xl p-3">
                  <CheckCircle2 size={15} className="text-mishell-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-mishell-700 flex-1">
                    Te registrarás como <strong>Socio/Propietario</strong>.{' '}
                    <button type="button" className="underline" onClick={() => setAsSocio(false)}>Cancelar</button>
                  </p>
                </div>
              )}
            </>
          )}

          {/* REGISTER — DNI */}
          {tab === 'register' && method === 'dni' && (
            <>
              <div className="flex gap-2">
                <Input icon={<User size={16} />} placeholder="Nombre"
                  value={dName} onChange={(e) => setDName(e.target.value)} required />
                <Input placeholder="Apellido"
                  value={dLastName} onChange={(e) => setDLastName(e.target.value)} required />
              </div>
              <Input icon={<CreditCard size={16} />} placeholder="Número de DNI"
                value={dDni} onChange={(e) => setDDni(e.target.value)} required inputMode="numeric" maxLength={12} />
              <Input icon={<KeyRound size={16} />} type="password" placeholder="PIN de acceso (4–6 dígitos)"
                value={dPin} onChange={(e) => setDPin(e.target.value)} required inputMode="numeric" maxLength={6} />
              <Input icon={<KeyRound size={16} />} type="password" placeholder="Confirmar PIN"
                value={dPinConf} onChange={(e) => setDPinConf(e.target.value)} required inputMode="numeric" maxLength={6} />

              {/* Photo upload */}
              <div>
                <p className="text-[10px] font-semibold text-ink-500 uppercase tracking-wider mb-1.5">Fotografía del documento</p>
                <button type="button" onClick={() => fileRef.current?.click()}
                  className={`w-full flex flex-col items-center gap-2 border-2 border-dashed rounded-2xl py-5 transition-colors
                    ${dPhoto ? 'border-mishell-400 bg-mishell-50' : 'border-ink-200 bg-white hover:border-ink-300'}`}>
                  {dPhoto ? (
                    <>
                      <CheckCircle2 size={26} className="text-mishell-600" />
                      <p className="text-sm font-medium text-mishell-700">Foto cargada</p>
                      <p className="text-xs text-mishell-600 truncate max-w-50">{dPhoto.name}</p>
                      <span className="text-xs text-ink-500 underline">Cambiar foto</span>
                    </>
                  ) : (
                    <>
                      <Camera size={26} className="text-ink-400" />
                      <p className="text-sm font-medium text-ink-900">Subir foto de DNI</p>
                      <p className="text-xs text-ink-400 text-center px-4">
                        Asegúrate de que los datos sean legibles y la foto sea nítida
                      </p>
                    </>
                  )}
                </button>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp"
                  capture="environment" className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    if (f.size > 5 * 1024 * 1024) { setError('La foto no puede superar 5 MB'); return; }
                    setError(''); setDPhoto(f);
                  }} />
              </div>
              <p className="text-xs text-ink-400 text-center -mt-1">
                Tu cuenta quedará pendiente de aprobación por el administrador.
              </p>
            </>
          )}

          {error && (
            <motion.p className="text-sm text-red-500 text-center"
              initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}>
              {error}
            </motion.p>
          )}

          <Button type="submit" loading={loading} className="mt-1">{btnLabel}</Button>
        </motion.form>
      </AnimatePresence>

      {/* Terms */}
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
