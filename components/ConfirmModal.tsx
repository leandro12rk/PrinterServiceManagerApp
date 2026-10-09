interface ConfirmModalProps {
  title: string;
  text: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmModal({ title, text, onCancel, onConfirm }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-4 md:items-center">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <h2 className="text-2xl font-black">{title}</h2>
        <p className="mt-3 text-lg text-slate-600">{text}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-xl bg-slate-200 px-5 py-3 font-bold">Cancelar</button>
          <button onClick={onConfirm} className="rounded-xl bg-rose-600 px-5 py-3 font-black text-white">Confirmar</button>
        </div>
      </div>
    </div>
  );
}
