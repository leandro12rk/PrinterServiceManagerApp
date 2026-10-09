interface StatusMessageProps {
  message: string | null;
  error: string | null;
  warning: string | null;
  onClose: () => void;
}

export function StatusMessage({ message, error, warning, onClose }: StatusMessageProps) {
  if (!message && !error && !warning) return null;
  const isWarning = !error && Boolean(warning);
  return (
    <div className={`mb-5 rounded-2xl border-2 p-4 font-bold ${error ? 'border-rose-300 bg-rose-50 text-rose-800' : isWarning ? 'border-amber-300 bg-amber-50 text-amber-900' : 'border-emerald-300 bg-emerald-50 text-emerald-800'}`}>
      <span className="mr-2">{error ? '✕' : isWarning ? '⚠' : '✓'}</span>
      {error || warning || message}
      <button className="float-right text-2xl" onClick={onClose} aria-label="Cerrar mensaje">×</button>
    </div>
  );
}
