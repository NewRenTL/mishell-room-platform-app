import { useState } from 'react';
import { User, Phone } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

interface Props {
  firstName: string;
  lastName: string;
  phone: string;
  onFirstName: (v: string) => void;
  onLastName: (v: string) => void;
  onPhone: (v: string) => void;
  onNext: () => void;
}

const PHONE_RE = /^9\d{8}$/;

export default function RegStep2Data({ firstName, lastName, phone, onFirstName, onLastName, onPhone, onNext }: Props) {
  const [phoneError, setPhoneError] = useState('');

  const phoneValid = !phone.trim() || PHONE_RE.test(phone.replace(/\s/g, ''));
  const canContinue = firstName.trim().length >= 2 && lastName.trim().length >= 2 && phoneValid;

  function handlePhone(v: string) {
    onPhone(v);
    if (v.trim() && !PHONE_RE.test(v.replace(/\s/g, ''))) {
      setPhoneError('Número inválido (9 dígitos, empieza con 9)');
    } else {
      setPhoneError('');
    }
  }

  return (
    <div className="px-5 pt-8 pb-6 flex flex-col gap-5">
      {/* Step heading */}
      <div>
        <h2 className="text-xl font-bold text-ink-900">Tus datos</h2>
        <p className="text-sm text-ink-500 mt-1">Ingresa tu información personal</p>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-3">
        <Input
          icon={<User size={16} />}
          placeholder="Nombre *"
          value={firstName}
          onChange={(e) => onFirstName(e.target.value)}
          required
        />
        <Input
          placeholder="Apellido *"
          value={lastName}
          onChange={(e) => onLastName(e.target.value)}
          required
        />
        <div>
          <Input
            icon={<Phone size={16} />}
            placeholder="Teléfono (opcional)"
            value={phone}
            onChange={(e) => handlePhone(e.target.value)}
            inputMode="tel"
            maxLength={9}
          />
          {phoneError && (
            <p className="mt-1 text-xs text-red-500 pl-1">{phoneError}</p>
          )}
        </div>
      </div>

      <Button onClick={onNext} disabled={!canContinue} className="mt-2">
        Continuar
      </Button>
    </div>
  );
}
