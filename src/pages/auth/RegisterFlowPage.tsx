import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AppHeader } from '../../components/layout/AppHeader';
import { Stepper } from '../../components/ui/Stepper';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../stores/authStore';
import RegStep1Role from './steps/RegStep1Role';
import RegStep2Data from './steps/RegStep2Data';
import RegStep3Access from './steps/RegStep3Access';

export type RegRole = 'INQUILINO' | 'SOCIO';

const STEPS = [
  { label: 'Tipo' },
  { label: 'Datos' },
  { label: 'Acceso' },
];

export default function RegisterFlowPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = (location.state as { from?: string } | null)?.from;
  const setAuth = useAuthStore((s) => s.setAuth);
  const [step, setStep] = useState(1);

  const [role, setRole] = useState<RegRole | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dni, setDni] = useState('');
  const [photoFront, setPhotoFront] = useState<File | null>(null);
  const [photoBack,  setPhotoBack]  = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleBack() {
    setError('');
    if (step > 1) {
      setStep((s) => s - 1);
    } else {
      navigate('/login');
    }
  }

  async function handleSubmit() {
    setError('');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Ingresa un correo electrónico válido');
      return;
    }
    if (!password) {
      setError('Ingresa una contraseña');
      return;
    }

    const isInquilino = role === 'INQUILINO';
    if (isInquilino) {
      if (!dni.trim()) {
        setError('El DNI es obligatorio');
        return;
      }
      if (!photoFront || !photoBack) {
        setError('Debes subir el anverso y reverso del documento');
        return;
      }
    }

    setLoading(true);
    try {
      const res = await authService.register(
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email,
          password,
          phone: phone || undefined,
          dni: dni.trim() || undefined,
          role: role ?? 'INQUILINO',
        },
        photoFront ?? undefined,
        photoBack ?? undefined,
      );
      const { accessToken, user } = res.data;
      setAuth(accessToken, user);
      navigate(fromPath ?? (user.role === 'SOCIO' ? '/socio' : '/home'), { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-107.5 mx-auto flex flex-col min-h-dvh bg-white">
      <AppHeader title="Crear cuenta" onBack={handleBack} />

      <Stepper steps={STEPS} current={step - 1} />

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <RegStep1Role
                selected={role}
                onSelect={(r) => { setRole(r); setStep(2); }}
              />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <RegStep2Data
                firstName={firstName}
                lastName={lastName}
                phone={phone}
                onFirstName={setFirstName}
                onLastName={setLastName}
                onPhone={setPhone}
                onNext={() => setStep(3)}
              />
            </motion.div>
          )}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <RegStep3Access
                role={role!}
                email={email}
                onEmail={setEmail}
                password={password}
                onPassword={setPassword}
                dni={dni}
                onDni={setDni}
                photoFront={photoFront}
                onPhotoFront={setPhotoFront}
                photoBack={photoBack}
                onPhotoBack={setPhotoBack}
                loading={loading}
                error={error}
                onSubmit={handleSubmit}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
