import Link from 'next/link';

export default function DocumentationPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 md:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl md:p-10">
          <Link href="/" className="font-bold text-blue-300 hover:text-blue-200">← Volver al panel</Link>
          <p className="mt-8 text-sm font-bold uppercase tracking-[.2em] text-blue-300">Guía de uso</p>
          <h1 className="mt-2 text-4xl font-black md:text-5xl">Documentación de Printer Service Manager</h1>
          <p className="mt-4 text-lg text-slate-300">Consulta, registra y administra los dispositivos de tu red desde un solo lugar.</p>
        </header>
        <article className="mt-6 space-y-6">
          <section className="rounded-3xl bg-white p-6 shadow-md md:p-8">
            <h2 className="text-2xl font-black">Registrar un dispositivo</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-6 text-lg text-slate-700">
              <li>Pulsa <strong>+ Registrar por IP</strong>.</li>
              <li>Escribe la dirección IP del equipo.</li>
              <li>Selecciona <strong>Impresora</strong>, <strong>Escáner</strong> o <strong>Impresora multifunción</strong>.</li>
              <li>Pulsa <strong>Validar y registrar</strong>. El sistema consultará la identidad y los consumibles por SNMP.</li>
            </ol>
            <p className="mt-5 rounded-xl bg-amber-50 p-4 text-amber-900"><strong>Requisito:</strong> el equipo debe estar encendido, ser accesible desde Docker, tener SNMP habilitado y aceptar la comunidad <code>public</code>.</p>
          </section>
          <section className="rounded-3xl bg-white p-6 shadow-md md:p-8">
            <h2 className="text-2xl font-black">Leer tinta y tóner</h2>
            <p className="mt-3 text-lg text-slate-700">Cada impresora muestra el porcentaje de sus consumibles. Pulsa <strong>Actualizar</strong> para consultar nuevamente la impresora.</p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-lg text-slate-700">
              <li>La tinta negra usa una barra negra.</li>
              <li>La tinta color usa una barra multicolor.</li>
              <li>Cyan, magenta, amarillo y otros consumibles usan una paleta específica.</li>
              <li>El modelo del cartucho aparece debajo de la barra, por ejemplo <strong>PG-145 / PG-145XL</strong> o <strong>CL-146 / CL-146XL</strong>.</li>
            </ul>
          </section>
          <section className="rounded-3xl bg-white p-6 shadow-md md:p-8">
            <h2 className="text-2xl font-black">Menú de acciones</h2>
            <p className="mt-3 text-lg text-slate-700">En cada tarjeta, junto al estado del equipo, encontrarás el icono 🌐 y el menú ⋮.</p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-lg text-slate-700">
              <li>🌐 abre el sitio web del dispositivo. Al pasar el cursor muestra el tooltip “Ir a sitio web”.</li>
              <li>⋮ abre las acciones de editar y eliminar.</li>
              <li>El menú se cierra al hacer clic fuera o pulsar <strong>Escape</strong>.</li>
              <li>La aplicación no envía comandos de apagado ni reinicio a los equipos.</li>
            </ul>
          </section>
          <section className="rounded-3xl bg-white p-6 shadow-md md:p-8">
            <h2 className="text-2xl font-black">Descargar información</h2>
            <p className="mt-3 text-lg text-slate-700">Selecciona el formato en la tarjeta de exportación del panel:</p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-lg text-slate-700">
              <li><strong>JSON:</strong> respaldo legible para integraciones y revisiones.</li>
              <li><strong>SQL:</strong> sentencias para restaurar los registros en PostgreSQL.</li>
            </ul>
          </section>
          <section className="rounded-3xl bg-white p-6 shadow-md md:p-8">
            <h2 className="text-2xl font-black">Datos recopilados</h2>
            <p className="mt-3 text-lg text-slate-700">La aplicación almacena información técnica necesaria para administrar cada equipo:</p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-lg text-slate-700">
              <li>IP, identificador y fechas de creación del registro.</li>
              <li>Nombre, marca, descripción y modelo obtenidos por SNMP.</li>
              <li>Estado activo/apagado y clasificación como impresora, escáner o multifunción.</li>
              <li>Consumibles, modelo de cartucho, nivel máximo, nivel actual y porcentaje.</li>
            </ul>
            <p className="mt-4 text-slate-600">La comunidad SNMP se utiliza para la consulta, pero no se guarda ni se incluye en las descargas.</p>
          </section>
          <section className="rounded-3xl bg-white p-6 shadow-md md:p-8">
            <h2 className="text-2xl font-black">Autoría y licencia</h2>
            <p className="mt-3 text-lg text-slate-700">Creado por <strong>leandrork12</strong>. Consulta el proyecto en <a className="font-bold text-blue-600 hover:text-blue-800" href="https://github.com/leandro12rk" target="_blank" rel="noopener noreferrer">GitHub</a>.</p>
            <p className="mt-3 text-lg text-slate-700">El código y la aplicación se distribuyen bajo la licencia <strong>MIT</strong>.</p>
          </section>
          <section className="rounded-3xl bg-white p-6 shadow-md md:p-8">
            <h2 className="text-2xl font-black">Solución de problemas</h2>
            <p className="mt-3 text-lg text-slate-700">Si aparece “Sin lectura”, verifica la IP, conectividad, SNMP y comunidad. Cuando la impresora publica nivel actual y máximo, la aplicación calcula el porcentaje con esos valores; si no, usa el porcentaje directo que entrega el fabricante.</p>
            <p className="mt-4 text-lg text-slate-700">En la Canon TS3100, la aplicación contrasta los OID SNMP con la interfaz web local de Canon porque el valor estándar puede no coincidir con el indicador oficial. Pulsa <strong>Actualizar</strong> para volver a consultar ambos depósitos.</p>
            <p className="mt-4 rounded-xl bg-amber-50 p-4 text-amber-900"><strong>Aviso:</strong> la aplicación consulta y administra registros, pero no apaga ni reinicia físicamente las impresoras.</p>
          </section>
        </article>
        <footer className="py-8 text-center text-sm font-semibold text-slate-500">Creado por <span className="font-black text-slate-700">leandrork12</span></footer>
      </div>
    </main>
  );
}
