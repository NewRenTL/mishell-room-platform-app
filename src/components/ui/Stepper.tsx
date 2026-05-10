interface Step {
  label: string;
}

interface StepperProps {
  steps: Step[];
  current: number; // 0-indexed
}

export function Stepper({ steps, current }: StepperProps) {
  return (
    <div className="flex items-center px-5 py-3 bg-white border-b border-ink-100 overflow-x-auto">
      {steps.map((step, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex items-center">
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div
                className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                  ${done   ? 'bg-ink-900 text-white' : ''}
                  ${active ? 'bg-mishell-600 text-white' : ''}
                  ${!done && !active ? 'border border-ink-200 text-ink-400' : ''}
                `}
              >
                {done ? '✓' : i + 1}
              </div>
              <span
                className={`text-xs whitespace-nowrap font-medium
                  ${active ? 'text-mishell-600 font-semibold' : ''}
                  ${done   ? 'text-ink-900' : ''}
                  ${!done && !active ? 'text-ink-400' : ''}
                `}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="w-5 h-px bg-ink-200 mx-2 flex-shrink-0" />
            )}
          </div>
        );
      })}
    </div>
  );
}
