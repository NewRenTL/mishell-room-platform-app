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

export default function RegStep2Data({ firstName, lastName, phone, onFirstName, onLastName, onPhone, onNext }: Props) {
  const canContinue = firstName.trim().length >= 2 && lastName.trim().length >= 2;

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
        <Input
          icon={<Phone size={16} />}
          placeholder="Teléfono (opcional)"
          value={phone}
          onChange={(e) => onPhone(e.target.value)}
          inputMode="tel"
        />
      </div>

      <Button onClick={onNext} disabled={!canContinue} className="mt-2">
        Continuar
      </Button>
    </div>
  );
}
