'use client';

import { ChangeEvent } from 'react';

type ExportFormat = 'json' | 'sql';

interface ExportDataProps {
  exportFormat: ExportFormat;
  onExportFormatChange: (format: ExportFormat) => void;
  onDownload: () => void;
}

export function ExportData({ exportFormat, onExportFormatChange, onDownload }: ExportDataProps) {
  function handleFormatChange(event: ChangeEvent<HTMLSelectElement>) {
    onExportFormatChange(event.target.value as ExportFormat);
  }

  return (
    <section className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-slate-500">Exportación</p>
        <h2 className="mt-1 text-xl font-black text-slate-800">Guarda tus registros</h2>
        <p className="mt-1 text-sm text-slate-500">Selecciona el formato que necesitas.</p>
      </div>
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
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
          onClick={onDownload}
          className="rounded-xl bg-slate-900 px-5 py-3 font-black text-white transition hover:bg-blue-700"
        >
          Descargar
        </button>
      </div>
    </section>
  );
}
