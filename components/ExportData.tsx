'use client';

import { ChangeEvent } from 'react';

type ExportFormat = 'json' | 'sql';

interface ExportDataProps {
  exportFormat: ExportFormat;
  onExportFormatChange: (format: ExportFormat) => void;
  onDownload: () => void;
  onClose: () => void;
  isClosing: boolean;
}

export function ExportData({ exportFormat, onExportFormatChange, onDownload, onClose, isClosing }: ExportDataProps) {
  function handleFormatChange(event: ChangeEvent<HTMLSelectElement>) {
    onExportFormatChange(event.target.value as ExportFormat);
  }

  return (
    <div
      className={`animate-export-modal fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm ${isClosing ? 'is-closing' : ''}`}
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-title"
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Exportación</p>
            <h2 id="export-title" className="mt-1 text-2xl font-black text-slate-800">Guarda tus registros</h2>
            <p className="mt-1 text-sm text-slate-500">Selecciona el formato que necesitas.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg px-2 text-2xl text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Cerrar exportación">×</button>
        </div>
        <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row">
        <label htmlFor="export-format" className="sr-only">Formato de descarga</label>
        <select
          id="export-format"
          value={exportFormat}
          onChange={handleFormatChange}
          className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 font-bold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        >
          <option value="json">Archivo JSON</option>
          <option value="sql">Archivo SQL</option>
        </select>
        <button
          type="button"
          onClick={() => { onDownload(); onClose(); }}
          className="rounded-xl bg-slate-900 px-5 py-3 font-black text-white transition hover:bg-blue-700"
        >
          Descargar
        </button>
        </div>
      </section>
    </div>
  );
}
