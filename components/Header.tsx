interface HeaderProps {
  printerCount: number;
  scannerCount: number;
  activeCount: number;
  onOpenExport: () => void;
}

export function Header({ printerCount, scannerCount, activeCount, onOpenExport }: HeaderProps) {
  return (
    <header className="relative mb-6 overflow-hidden rounded-[2rem] bg-slate-900 px-6 py-8 text-white shadow-lg shadow-slate-300/50 md:px-10 md:py-10">
      <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[.2em] text-blue-300">
            Printer Service Manager
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">
            Dispositivos de red
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-300">
            Un solo lugar para conocer el estado y los consumibles de tus impresoras y escáneres.
          </p>
          <a
            href="/docs"
            className="mt-6 inline-block border-b-2 border-blue-300 pb-1 font-bold text-blue-200 transition hover:border-white hover:text-white"
          >
            Ver documentación de uso →
          </a>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:min-w-[23rem] lg:flex-col">
          <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="border-r border-white/10 px-2">
              <p className="text-2xl font-black">{printerCount + scannerCount}</p>
              <p className="text-xs text-slate-400">registrados</p>
            </div>
            <div className="border-r border-white/10 px-2">
              <p className="text-2xl font-black text-emerald-300">{activeCount}</p>
              <p className="text-xs text-slate-400">activos</p>
            </div>
            <div className="px-2">
              <p className="text-2xl font-black text-blue-300">SNMP</p>
              <p className="text-xs text-slate-400">monitoreo</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenExport}
            title="Abrir exportación"
            aria-label="Abrir exportación"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-300/30 bg-blue-400/10 px-4 py-3 font-bold text-blue-100 transition hover:bg-blue-400/20"
          >
            <span className="text-xl" aria-hidden="true">⇩</span>
            Exportar registros
          </button>
        </div>
      </div>
    </header>
  );
}
