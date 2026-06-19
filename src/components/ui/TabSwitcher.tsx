import type { ReactNode } from 'react';

interface Tab {
  key: string;
  label: string;
  icon?: ReactNode;
}

interface TabSwitcherProps {
  tabs: Tab[];
  active: string;
  onChange: (key: string) => void;
  dark?: boolean;
}

export function TabSwitcher({ tabs, active, onChange, dark = false }: TabSwitcherProps) {
  return (
    <div className="flex bg-ink-50 rounded-full p-1 gap-1">
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`
              flex-1 py-2 rounded-full text-sm text-center transition-all font-medium
              flex items-center justify-center gap-1.5
              ${isActive
                ? dark
                  ? 'bg-ink-900 text-white font-semibold shadow-sm'
                  : 'bg-white text-ink-900 font-semibold shadow-sm'
                : 'text-ink-600 hover:text-ink-900'
              }
            `}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
