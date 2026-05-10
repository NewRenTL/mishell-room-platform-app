export function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
}

export function fmtDate(iso: string) {
  const d = new Date(iso);
  const diffDays = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  return d.toLocaleDateString('es-PE', { day: 'numeric', month: 'long' });
}

export function groupByDate<T extends { createdAt: string; id: string }>(messages: T[]) {
  const groups: Record<string, T[]> = {};
  for (const m of messages) {
    const key = new Date(m.createdAt).toDateString();
    if (!groups[key]) groups[key] = [];
    groups[key].push(m);
  }
  return groups;
}
