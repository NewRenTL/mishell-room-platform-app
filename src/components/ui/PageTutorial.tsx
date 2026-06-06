import { useState } from 'react';
import Joyride, { type CallBackProps, type Step, STATUS } from 'react-joyride';
import { HelpCircle } from 'lucide-react';

export interface TutorialStep {
  title: string;
  content: string;
}

interface Props {
  id: string;
  steps: TutorialStep[];
  buttonBottom?: string;
}

export function PageTutorial({ id, steps, buttonBottom = 'bottom-24' }: Props) {
  const storageKey = `mishell-tutorial-${id}`;
  const [run, setRun] = useState(() => !localStorage.getItem(storageKey));

  const joyrideSteps: Step[] = steps.map((s) => ({
    target: 'body',
    placement: 'center' as const,
    disableBeacon: true,
    title: s.title,
    content: s.content,
  }));

  function handleCallback({ status }: CallBackProps) {
    if ((status as string) === STATUS.FINISHED || (status as string) === STATUS.SKIPPED) {
      localStorage.setItem(storageKey, '1');
      setRun(false);
    }
  }

  return (
    <>
      <Joyride
        steps={joyrideSteps}
        run={run}
        continuous
        showProgress
        showSkipButton
        disableScrolling
        callback={handleCallback}
        styles={{
          options: {
            primaryColor: '#E8272A',
            backgroundColor: '#ffffff',
            textColor: '#1A1A1A',
            zIndex: 10000,
          },
          buttonNext: {
            borderRadius: '14px',
            padding: '10px 22px',
            fontWeight: 600,
            fontSize: '13px',
          },
          buttonBack: {
            borderRadius: '14px',
            padding: '10px 22px',
            fontWeight: 600,
            fontSize: '13px',
            color: '#E8272A',
          },
          buttonSkip: {
            fontSize: '12px',
            color: '#9E9E9E',
          },
          tooltip: {
            borderRadius: '20px',
            padding: '20px',
            fontFamily: "'Sora', system-ui, sans-serif",
            maxWidth: '320px',
          },
          tooltipTitle: {
            fontSize: '15px',
            fontWeight: 700,
            color: '#1A1A1A',
            marginBottom: '8px',
          },
          tooltipContent: {
            fontSize: '13px',
            color: '#6B6B6B',
            lineHeight: '1.55',
            padding: '0',
          },
          tooltipFooter: {
            marginTop: '16px',
          },
        }}
        locale={{
          back: 'Anterior',
          close: 'Cerrar',
          last: 'Entendido',
          next: 'Siguiente →',
          skip: 'Saltar tutorial',
        }}
      />

      <button
        type="button"
        onClick={() => setRun(true)}
        className={`fixed ${buttonBottom} right-4 z-40 w-10 h-10 rounded-full bg-mishell-600 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform`}
        aria-label="Ayuda"
        title="Ver tutorial"
      >
        <HelpCircle size={19} />
      </button>
    </>
  );
}
