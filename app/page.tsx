'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ConfirmModal } from '@/components/ConfirmModal';
import { DeviceCard } from '@/components/DeviceCard';
import { DeviceForm } from '@/components/DeviceForm';
import { ExportData } from '@/components/ExportData';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { StatusMessage } from '@/components/StatusMessage';
import { Device, Filter, FormValues, Tab } from '@/components/types';

const emptyForm: FormValues = { ip: '', kind: 'printer', active: true };

export default function Home() {
  const [tab, setTab] = useState<Tab>('printers');
  const [printers, setPrinters] = useState<Device[]>([]);
  const [scanners, setScanners] = useState<Device[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<{ tab: Tab; id: number } | null>(null);
  const [menuId, setMenuId] = useState<number | null>(null);
  const [modal, setModal] = useState<{ title: string; text: string; action?: () => void } | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'sql'>('json');
  const [showExport, setShowExport] = useState(false);
  const devices = tab === 'printers' ? printers : scanners;
  const visible = useMemo(() => devices.filter((device) => filter === 'all' || (filter === 'active' ? device.active : !device.active)), [devices, filter]);

  useEffect(() => { void Promise.all([load('printers'), load('scanners')]); }, []);
  useEffect(() => {
    const closeMenu = (event: MouseEvent) => { if (!(event.target as HTMLElement).closest('[data-device-menu]')) setMenuId(null); };
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuId(null); };
    document.addEventListener('click', closeMenu);
    document.addEventListener('keydown', closeOnEscape);
    return () => { document.removeEventListener('click', closeMenu); document.removeEventListener('keydown', closeOnEscape); };
  }, []);
  useEffect(() => {
    const closeExportOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setShowExport(false); };
    document.addEventListener('keydown', closeExportOnEscape);
    return () => document.removeEventListener('keydown', closeExportOnEscape);
  }, []);

  async function load(type: Tab) {
    const response = await fetch(`/api/${type}`);
    if (!response.ok) throw new Error('No se pudieron cargar los dispositivos');
    const data = await response.json();
    if (type === 'printers') setPrinters(data); else setScanners(data);
  }
  function notify(text: string, type: 'success' | 'warning' | 'error' = 'success') {
    setMessage(type === 'success' ? text : null);
    setWarning(type === 'warning' ? text : null);
    setError(type === 'error' ? text : null);
  }
  function openCreate() { setEditing(null); setForm({ ...emptyForm, kind: tab === 'printers' ? 'printer' : 'scanner' }); setShowForm(true); }
  function openEdit(device: Device) {
    setEditing({ tab, id: device.id });
    setForm({ ip: device.ip, kind: tab === 'printers' ? (device.isMultifunction ? 'multifunction' : 'printer') : 'scanner', active: device.active });
    setShowForm(true); setMenuId(null); window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  async function discover(ip: string) {
    const response = await fetch('/api/discover', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ip }) });
    const data = await response.json(); if (!response.ok) throw new Error(data.error); return data;
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError(null);
    try {
      const found = await discover(form.ip.trim());
      const payload = { ...found, active: form.active, isMultifunction: form.kind === 'multifunction' };
      if (editing) {
        const response = await fetch(`/api/${editing.tab}/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await response.json(); if (!response.ok) throw new Error(data.error); await load(editing.tab);
      } else {
        const types: Tab[] = form.kind === 'multifunction' ? ['printers', 'scanners'] : [form.kind === 'printer' ? 'printers' : 'scanners'];
        for (const type of types) {
          const response = await fetch(`/api/${type}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const data = await response.json(); if (!response.ok) throw new Error(data.error); await load(type);
        }
      }
      setShowForm(false); notify('Dispositivo registrado con datos obtenidos de la IP.');
    } catch (saveError) { notify(saveError instanceof Error ? saveError.message : 'No se pudo registrar el dispositivo', 'error'); }
    finally { setSaving(false); }
  }
  function askDelete(device: Device) {
    setMenuId(null); setModal({ title: 'Eliminar dispositivo', text: `¿Eliminar "${device.name}"? Esta acción no se puede deshacer.`, action: async () => {
      const response = await fetch(`/api/${tab}/${device.id}`, { method: 'DELETE' });
      if (!response.ok) { const data = await response.json(); throw new Error(data.error); }
      await load(tab); notify('Registro eliminado correctamente.');
    } });
  }
  async function refreshToner(device: Device) {
    setMenuId(null);
    try {
      const response = await fetch(`/api/printers/${device.id}/toner`, { method: 'POST' });
      const data = await response.json(); if (!response.ok) throw new Error(data.error);
      await load('printers'); notify(data.toners?.length ? 'Niveles de tóner actualizados.' : 'La impresora no informó niveles de tóner por SNMP.', data.toners?.length ? 'success' : 'warning');
    } catch (refreshError) { notify(refreshError instanceof Error ? refreshError.message : 'No se pudo actualizar el tóner', 'error'); }
  }
  async function confirmModal() {
    if (!modal?.action) return;
    try { await modal.action(); setModal(null); } catch (actionError) { notify(actionError instanceof Error ? actionError.message : 'No se pudo completar la acción', 'error'); setModal(null); }
  }
  async function download() {
    const response = await fetch(`/api/backup?format=${exportFormat}`);
    if (!response.ok) { notify('No se pudo generar la descarga.', 'error'); return; }
    const blob = await response.blob();
    const filename = response.headers.get('Content-Disposition')?.match(/filename="([^"]+)"/i)?.[1] ?? `data-registrada.${exportFormat}`;
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl; link.download = filename; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(objectUrl);
    notify(`Data registrada descargada en ${exportFormat.toUpperCase()}.`);
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 text-slate-900 md:px-8">
      <div className="mx-auto max-w-6xl">
        <Header
          printerCount={printers.length}
          scannerCount={scanners.length}
          activeCount={[...printers, ...scanners].filter((device) => device.active).length}
          onOpenExport={() => setShowExport(true)}
        />
        <StatusMessage message={message} error={error} warning={warning} onClose={() => { setError(null); setWarning(null); setMessage(null); }} />
        {showExport && <ExportData exportFormat={exportFormat} onExportFormatChange={setExportFormat} onDownload={download} onClose={() => setShowExport(false)} />}
        <nav className="mb-6 flex flex-wrap gap-3"><button onClick={() => { setTab('printers'); setFilter('all'); }} className={`rounded-2xl px-6 py-4 text-xl font-black shadow ${tab === 'printers' ? 'bg-blue-600 text-white' : 'bg-white'}`}>Impresoras ({printers.length})</button><button onClick={() => { setTab('scanners'); setFilter('all'); }} className={`rounded-2xl px-6 py-4 text-xl font-black shadow ${tab === 'scanners' ? 'bg-emerald-600 text-white' : 'bg-white'}`}>Escáneres ({scanners.length})</button><button onClick={openCreate} className="rounded-2xl bg-slate-800 px-6 py-4 text-xl font-black text-white">+ Registrar por IP</button></nav>
        {showForm && <DeviceForm editing={Boolean(editing)} form={form} saving={saving} onChange={setForm} onSubmit={save} onClose={() => setShowForm(false)} />}
        <section className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-2xl font-black">{tab === 'printers' ? 'Impresoras' : 'Escáneres'}</h2><p className="text-slate-500">{visible.length} dispositivo(s)</p></div><div className="flex gap-1 rounded-xl bg-white p-1 shadow">{(['all', 'active', 'inactive'] as Filter[]).map((value) => <button key={value} onClick={() => setFilter(value)} className={`rounded-lg px-3 py-2 font-bold ${filter === value ? 'bg-slate-800 text-white' : ''}`}>{value === 'all' ? 'Todos' : value === 'active' ? 'Activos' : 'Apagados'}</button>)}</div></section>
        <section className="grid gap-5 md:grid-cols-2">{visible.map((device) => <DeviceCard key={device.id} device={device} isPrinter={tab === 'printers'} menuOpen={menuId === device.id} onToggleMenu={() => setMenuId(menuId === device.id ? null : device.id)} onEdit={() => openEdit(device)} onDelete={() => askDelete(device)} onRefreshToner={() => refreshToner(device)} />)}</section>
        {visible.length === 0 && <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white p-12 text-center text-xl font-bold text-slate-500">No hay dispositivos en este filtro.</div>}
        <Footer />
        {modal && <ConfirmModal title={modal.title} text={modal.text} onCancel={() => setModal(null)} onConfirm={confirmModal} />}
      </div>
    </main>
  );
}
