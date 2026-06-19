import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { AppHeader } from '../../components/layout/AppHeader';
import { Stepper } from '../../components/ui/Stepper';
import { propertiesService } from '../../services/properties.service';
import { useBookingStore } from '../../stores/bookingStore';
import Step1Guest from './steps/Step1Guest';
import Step2Contract from './steps/Step2Contract';
import Step3Payment from './steps/Step3Payment';
import Step4Confirm from './steps/Step4Confirm';

const STEPS = [
  { label: 'Datos' },
  { label: 'Contrato' },
  { label: 'Pago' },
  { label: 'Confirmar' },
];

export default function BookingFlowPage() {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const bookingId = useBookingStore((s) => s.bookingId);
  const contractId = useBookingStore((s) => s.contractId);

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: () => propertiesService.getOne(propertyId!).then((r) => r.data),
    enabled: !!propertyId,
  });

  if (isLoading) {
    return (
      <div className="max-w-107.5 mx-auto flex flex-col min-h-dvh bg-white">
        <AppHeader title="Reservar" />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-mishell-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-107.5 mx-auto flex flex-col min-h-dvh bg-white">
      <AppHeader title={property?.title ?? 'Reservar'} />

      <div className="px-5 pt-4 pb-2">
        <Stepper steps={STEPS} current={step - 1} />
      </div>

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
              <Step1Guest
                propertyId={propertyId!}
                property={property}
                onNext={() => setStep(2)}
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
              <Step2Contract
                bookingId={bookingId!}
                hasContract={!!contractId}
                onNext={() => setStep(3)}
                onSkip={() => setStep(3)}
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
              <Step3Payment
                bookingId={bookingId!}
                onNext={() => setStep(4)}
              />
            </motion.div>
          )}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <Step4Confirm
                bookingId={bookingId!}
                property={property}
                onSuccess={() => navigate(`/booking/success/${bookingId}`, { replace: true })}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
