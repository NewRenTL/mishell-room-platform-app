import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AppHeader } from '../../components/layout/AppHeader';
import { Stepper } from '../../components/ui/Stepper';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../stores/authStore';
import RegStep1Role from './steps/RegStep1Role';
import RegStep2Data from './steps/RegStep2Data';
import RegStep3Access from './steps/RegStep3Access';

export type RegRole = 'INQUILINO' | 'SOCIO';
export type RegMethod = 'email' | 'dni';

const STEPS = [
  { label: 'Tipo' },
  { label: 'Datos' },
  { label: 'Acceso' },
];

export default function RegisterFlowPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [step, setStep] = useState(1);

  const [role, setRole] = useState<RegRole | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  const [regMethod, setRegMethod] = useState<RegMethod>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dni, setDni] = useState('');
  const [pin, setPin] = useState('');
  const [pinConf, setPinConf] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);

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

    if (regMethod === 'dni') {
      if (pin !== pinConf) { setError('Los PINs no coinciden'); return; }
      if (!/^\d{4,6}$/.test(pin)) { setError('El PIN debe tener entre 4 y 6 dígitos'); return; }
    }

    setLoading(true);
    try {
      if (regMethod === 'email') {
        const res = await authService.register({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email,
          password,
          phone: phone || undefined,
          role: role ?? 'INQUILINO',
        });
        const { accessToken, user } = res.data;
        setAuth(accessToken, user);
        navigate(user.role === 'SOCIO' ? '/socio' : '/home', { replace: true });
      } else {
        const res = await authService.registerByDni(
          {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            dni,
            pin,
            phone: phone || undefined,
            role: role ?? 'INQUILINO',
          },
          photo ?? undefined,
        );
        const { accessToken, user } = res.data;
        setAuth(accessToken, user);
        navigate(user.role === 'SOCIO' ? '/socio' : '/home', { replace: true });
      }
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-[430px] mx-auto flex flex-col min-h-dvh bg-white">
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
                regMethod={regMethod}
                onRegMethod={setRegMethod}
                email={email}
                onEmail={setEmail}
                password={password}
                onPassword={setPassword}
                dni={dni}
                onDni={setDni}
                pin={pin}
                onPin={setPin}
                pinConf={pinConf}
                onPinConf={setPinConf}
                photo={photo}
                onPhoto={setPhoto}
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
