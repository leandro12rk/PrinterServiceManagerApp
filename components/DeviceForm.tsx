import { FormEvent } from 'react';
import { DeviceKind, FormValues } from './types';

interface DeviceFormProps {
  editing: boolean;
  form: FormValues;
  saving: boolean;
  onChange: (form: FormValues) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

export function DeviceForm({ editing, form, saving, onChange, onSubmit, onClose }: DeviceFormProps) {
  return (
    <form onSubmit={onSubmit} className="mb-8 rounded-3xl bg-white p-6 shadow-lg">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-black">{editing ? 'Actualizar dispositivo' : 'Registrar dispositivo por IP'}</h2>
          <p className="text-slate-500">Se consultará SNMP para obtener identidad y consumibles.</p>
        </div>
        <button type="button" onClick={onClose} className="text-3xl text-slate-400" aria-label="Cerrar formulario">×</button>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="font-bold">
          Dirección IP
          <input required value={form.ip} onChange={(event) => onChange({ ...form, ip: event.target.value })} placeholder="192.168.1.100" className="mt-2 w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-lg font-normal" />
        </label>
        <label className="font-bold">
          Tipo de dispositivo
          <select value={form.kind} onChange={(event) => onChange({ ...form, kind: event.target.value as DeviceKind })} className="mt-2 w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-lg font-normal">
            <option value="printer">Impresora</option>
            <option value="scanner">Escáner</option>
            <option value="multifunction">Impresora multifunción (impresora + escáner)</option>
          </select>
        </label>
      </div>
      <label className="mt-4 flex items-center gap-2 font-bold">
        <input type="checkbox" checked={form.active} onChange={(event) => onChange({ ...form, active: event.target.checked })} />
        Dispositivo activo
      </label>
      <button disabled={saving} className="mt-5 rounded-xl bg-blue-600 px-6 py-3 font-black text-white disabled:opacity-50">
        {saving ? 'Consultando IP...' : 'Validar y registrar'}
      </button>
    </form>
  );
}
