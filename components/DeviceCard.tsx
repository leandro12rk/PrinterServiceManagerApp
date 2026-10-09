import { Device, Toner } from './types';

const tonerPalette = ['bg-cyan-500', 'bg-fuchsia-500', 'bg-yellow-400', 'bg-purple-500', 'bg-orange-500', 'bg-emerald-500'];

function tonerColor(name: string, index: number) {
  const normalized = name.toLowerCase();
  if (normalized.includes('black') || normalized.includes('negro')) return 'bg-black';
  if (normalized.includes('cyan') || normalized.includes('azul')) return 'bg-cyan-500';
  if (normalized.includes('magenta') || normalized.includes('rojo') || normalized.includes('red')) return 'bg-fuchsia-500';
  if (normalized.includes('yellow') || normalized.includes('amarillo')) return 'bg-yellow-400';
  if (normalized.includes('color')) return 'bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-yellow-400';
  return tonerPalette[index % tonerPalette.length];
}

interface DeviceCardProps {
  device: Device;
  isPrinter: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onRefreshToner: () => void;
}

function TonerLevel({ toner, index }: { toner: Toner; index: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm font-bold">
        <span>{toner.name}</span>
        <span>{toner.percentage === null ? 'Sin lectura' : `${toner.percentage}%`}</span>
      </div>
      <div className="mt-1 h-4 overflow-hidden rounded-full bg-slate-200">
        <div className={`h-full rounded-full transition-all duration-700 ${tonerColor(toner.name, index)}`} style={{ width: `${toner.percentage ?? 0}%` }} />
      </div>
      <p className="mt-1 text-xs font-semibold text-slate-500">Modelo de tinta: {toner.model || toner.name}</p>
    </div>
  );
}

export function DeviceCard({ device, isPrinter, menuOpen, onToggleMenu, onEdit, onDelete, onRefreshToner }: DeviceCardProps) {
  return (
    <article className="rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-md">
      <div className="flex justify-between gap-3">
        <div>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-black text-blue-800">{device.brand}</span>
          <h3 className="mt-3 text-2xl font-black">{device.name}</h3>
          <p className="text-slate-500">{device.model || 'Modelo no informado'} · {device.ip}</p>
        </div>
        <div data-device-menu className="relative flex items-start gap-2">
          <span className={`rounded-full px-3 py-1 text-sm font-black ${device.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>{device.active ? '● Activa' : '● Apagada'}</span>
          <a href={`http://${device.ip}`} target="_blank" rel="noopener noreferrer" title="Ir a sitio web" aria-label="Ir a sitio web" className="rounded-lg px-2 py-1 text-lg hover:bg-slate-100">🌐</a>
          <button onClick={onToggleMenu} className="rounded-lg px-2 text-xl font-black leading-5 text-slate-500 hover:bg-slate-100" aria-label="Abrir acciones">⋮</button>
          {menuOpen && (
            <div className="absolute right-0 top-8 z-20 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
              <button onClick={onEdit} className="block w-full rounded-lg px-3 py-2 text-left font-bold hover:bg-blue-50">✏️ Editar</button>
              <button onClick={onDelete} className="block w-full rounded-lg px-3 py-2 text-left font-bold hover:bg-rose-50">🗑️ Eliminar</button>
            </div>
          )}
        </div>
      </div>
      {isPrinter && (
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-slate-700">Niveles de tinta / tóner</h4>
            <button onClick={onRefreshToner} className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700 hover:bg-slate-200">Actualizar</button>
          </div>
          {device.toners?.length ? device.toners.map((toner, index) => <TonerLevel key={`${toner.name}-${index}`} toner={toner} index={index} />) : <p className="text-sm text-slate-500">No se detectaron consumibles por SNMP. Pulsa Actualizar.</p>}
        </div>
      )}
    </article>
  );
}
