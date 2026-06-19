import { useEffect, useState, useMemo } from 'react';
import { Joyride, type CallBackProps, type Step, type Placement, STATUS } from 'react-joyride';
import { HelpCircle } from 'lucide-react';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

export interface TutorialStep {
  title: string;
  content: string;
  /** CSS selector to highlight. Omit (or use 'body') for centered modal. */
  target?: string;
  /** Override placement. Defaults to 'auto' for targeted steps, 'center' for centered. */
  placement?: Placement;
}

interface Props {
  id: string;
  steps: TutorialStep[];
  buttonBottom?: string;
}

function filterExistingTargets(steps: TutorialStep[]): TutorialStep[] {
  if (typeof document === 'undefined') return steps;
  return steps.filter((s) => {
    if (!s.target || s.target === 'body') return true;
    try {
      return !!document.querySelector(s.target);
    } catch {
      return false;
    }
  });
}

export function PageTutorial({ id: _id, steps, buttonBottom = 'bottom-24' }: Props) {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const filteredSteps = useMemo(() => (run ? filterExistingTargets(steps) : steps), [run, steps]);

  const joyrideSteps: Step[] = filteredSteps.map((s) => {
    const hasTarget = !!s.target && s.target !== 'body';
    return {
      target: s.target ?? 'body',
      placement: s.placement ?? (hasTarget ? 'auto' : 'center'),
      disableBeacon: true,
      title: s.title,
      content: s.content,
      spotlightPadding: hasTarget ? 8 : 0,
      styles: hasTarget ? undefined : { options: { arrowColor: 'transparent' } },
    };
  });

  function handleCallback({ status, index, type, action }: CallBackProps) {
    if ((status as string) === STATUS.FINISHED || (status as string) === STATUS.SKIPPED) {
      setRun(false);
      setStepIndex(0);
      return;
    }
    // Track step index so closing/reopening continues correctly
    if (type === 'step:after' && action === 'next') setStepIndex(index + 1);
    if (type === 'step:after' && action === 'prev') setStepIndex(Math.max(0, index - 1));
  }

  function openTutorial() {
    setStepIndex(0);
    setRun(true);
  }

  function closeTutorial() {
    setRun(false);
    setStepIndex(0);
  }

  // Capacitor Android back button closes the tutorial instead of exiting the app
  useEffect(() => {
    if (!run || !Capacitor.isNativePlatform()) return;
    let listenerHandle: { remove: () => void } | undefined;
    CapacitorApp.addListener('backButton', () => closeTutorial()).then((h) => { listenerHandle = h; });
    return () => { listenerHandle?.remove(); };
  }, [run]);

  return (
    <>
      <Joyride
        steps={joyrideSteps}
        run={run}
        stepIndex={stepIndex}
        continuous
        showProgress
        showSkipButton
        scrollToFirstStep
        scrollOffset={120}
        disableOverlayClose
        spotlightClicks={false}
        callback={handleCallback}
        styles={{
          options: {
            primaryColor: '#E8272A',
            backgroundColor: '#ffffff',
            textColor: '#1A1A1A',
            overlayColor: 'rgba(0, 0, 0, 0.55)',
            zIndex: 10000,
            arrowColor: '#ffffff',
          },
          spotlight: {
            borderRadius: '16px',
            boxShadow: '0 0 0 4px rgba(232, 39, 42, 0.35), 0 8px 24px rgba(0,0,0,0.25)',
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
        onClick={openTutorial}
        className={`fixed ${buttonBottom} right-4 z-40 w-10 h-10 rounded-full bg-mishell-600 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform`}
        aria-label="Ayuda"
        title="Ver tutorial"
      >
        <HelpCircle size={19} />
      </button>
    </>
  );
}
