import { useRef, useState, useEffect } from 'react';
import { PenLine } from 'lucide-react';

interface SignatureCanvasProps {
  onSave: (dataUrl: string) => void;
  height?: number;
}

export function SignatureCanvas({ onSave, height = 180 }: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasStrokes, setHasStrokes] = useState(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  function getPoint(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      const t = e.touches[0];
      return { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    setIsDrawing(true);
    lastPoint.current = getPoint(e);
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    if (!isDrawing || !lastPoint.current) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const point = getPoint(e);
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPoint.current = point;
    setHasStrokes(true);
  }

  function endDraw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    setIsDrawing(false);
    lastPoint.current = null;
  }

  function clear() {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasStrokes(false);
  }

  function save() {
    if (!hasStrokes) return;
    const canvas = canvasRef.current!;
    onSave(canvas.toDataURL('image/png'));
  }

  return (
    <div className="w-full">
      <div
        className={`
          relative border-2 rounded-2xl overflow-hidden transition-colors
          ${hasStrokes ? 'border-mishell-600 bg-white shadow-inner' : 'border-dashed border-ink-200 bg-ink-50'}
        `}
        style={{ height }}
      >
        {!hasStrokes && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-2">
            <PenLine size={28} className="text-ink-400" />
            <p className="text-sm text-ink-400">Firma aquí con tu dedo</p>
          </div>
        )}
        <canvas
          ref={canvasRef}
          width={600}
          height={height * 2}
          className="w-full h-full touch-none cursor-crosshair"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        {hasStrokes && (
          <button
            onClick={clear}
            className="absolute top-2 right-2 text-xs text-ink-400 underline bg-white/80 px-2 py-0.5 rounded-lg"
          >
            Limpiar
          </button>
        )}
      </div>
      {hasStrokes && (
        <button
          onClick={save}
          className="mt-3 w-full py-3 rounded-xl bg-mishell-600 text-white text-sm font-semibold hover:bg-mishell-500 active:bg-mishell-700 transition-colors"
        >
          Guardar firma
        </button>
      )}
    </div>
  );
}
