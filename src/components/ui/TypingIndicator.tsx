import { motion } from 'motion/react';

interface TypingIndicatorProps {
  label?: string;
}

export function TypingIndicator({ label }: TypingIndicatorProps) {
  return (
    <div className="flex justify-start">
      <div className="bg-white border border-ink-100 rounded-2xl rounded-bl-sm px-4 py-3">
        {label && <p className="text-[10px] font-bold text-mishell-600 mb-1">{label}</p>}
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-ink-400"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
