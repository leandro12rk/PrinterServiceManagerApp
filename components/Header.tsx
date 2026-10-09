export function Header() {
  return (
    <header className="mb-6 rounded-[2rem] bg-slate-900 px-6 py-8 text-white shadow-lg shadow-slate-300/50 md:px-10 md:py-10">
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
    </header>
  );
}
