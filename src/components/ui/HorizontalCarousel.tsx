import { useRef, useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  children: React.ReactNode;
  scrollAmount?: number;
}

export function HorizontalCarousel({ children, scrollAmount = 220 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', update); ro.disconnect(); };
  }, [update]);

  function scroll(dir: 'left' | 'right') {
    ref.current?.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  }

  return (
    <div className="relative -mx-5">
      {/* Left arrow */}
      <AnimatePresence>
        {canLeft && (
          <motion.button
            key="left"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15 }}
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center border border-ink-100"
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={16} className="text-ink-700" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Scroll container */}
      <div
        ref={ref}
        className="flex gap-3 overflow-x-auto pb-2 px-5 scrollbar-none scroll-smooth"
      >
        {children}
      </div>

      {/* Right arrow */}
      <AnimatePresence>
        {canRight && (
          <motion.button
            key="right"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15 }}
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center border border-ink-100"
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight size={16} className="text-ink-700" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
