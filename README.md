# Printer Service Manager

Aplicación web para registrar y administrar impresoras, escáneres y equipos multifunción en una red local. El registro se realiza con la dirección IP: el servidor consulta la identidad y los consumibles por SNMP, guarda la información en PostgreSQL y la presenta en un panel web.

## Características

- Registro por IP sin escribir manualmente nombre, marca o modelo.
- Selector de tipo: impresora, escáner o impresora multifunción.
- Un equipo multifunción se guarda en las vistas de impresoras y escáneres.
- Estado manual del dispositivo: activa o apagada.
- CRUD completo para impresoras y escáneres.
- Consulta y actualización de tinta/tóner mediante SNMP.
- Barras de consumibles:
  - Negro: barra negra.
  - Cyan, magenta, amarillo y colores conocidos: color representativo.
  - Consumibles adicionales: paleta rotatoria para admitir cinco o más colores.
- Modelo del consumible debajo de cada barra.
- Menú de acciones de tres puntos junto al estado:
  - Editar.
  - Eliminar.
  - Abrir web.
- Modales flotantes para acciones destructivas o de control; no se usan alertas nativas del navegador.
- Descarga de la información registrada en JSON o SQL.
- Mensajes diferenciados para éxito, advertencias y errores.

La aplicación no apaga ni reinicia impresoras. Esas acciones se retiraron porque no existe una operación SNMP universal y confiable para todos los fabricantes; el panel se limita a consultar datos y administrar los registros.

La descarga JSON incluye los metadatos `application` y `generatedAt`, además de las colecciones `printers` y `scanners`. No incluye información del creador. El archivo se entrega como adjunto con un nombre único basado en la fecha. La descarga SQL conserva un comentario de autoría.

## Autoría y licencia

- Creado por: **leandrork12**
- GitHub: [github.com/leandro12rk](https://github.com/leandro12rk)
- Licencia: **MIT**, consultable en [`LICENSE`](./LICENSE).

## Datos recopilados

La aplicación recopila y almacena únicamente datos técnicos del dispositivo:

- Dirección IP y fechas/identificadores generados por la base de datos.
- Nombre, marca, descripción y modelo obtenidos por SNMP.
- Estado activo/apagado y si el equipo es multifunción.
- Consumibles detectados: nombre, modelo de cartucho, nivel, máximo y porcentaje.
- La comunidad SNMP se usa para consultar el equipo, pero no se exporta ni se guarda.

## Arquitectura

```text
app/
├── api/
│   ├── backup/route.ts                 # Exportación JSON y SQL
│   ├── discover/route.ts               # Descubrimiento SNMP por IP
│   ├── printers/route.ts               # Listado y alta de impresoras
│   ├── printers/[id]/route.ts          # Edición y eliminación
│   ├── printers/[id]/toner/route.ts    # Actualización de consumibles
│   └── scanners/...                    # Endpoints equivalentes de escáneres
├── page.tsx                            # Panel web y formularios
└── globals.css                         # Estilos globales y Tailwind
lib/
├── prisma.ts                            # Cliente Prisma compartido
└── snmp-discovery.ts                    # Lectura de identidad y consumibles
prisma/
└── schema.prisma                        # Modelos Printer y Scanner
Dockerfile                                # Imagen Node y generación Prisma
docker-compose.yml                        # App y PostgreSQL
```

## Flujo de registro

1. El usuario pulsa **Registrar por IP**.
2. Introduce la IP y selecciona el tipo de dispositivo.
3. `POST /api/discover` abre una sesión SNMP con comunidad `public`.
4. Se consultan:
   - `sysName` para el nombre.
   - `sysDescr` para marca y modelo.
   - Tabla `prtMarkerSupplies` para consumibles.
5. Se consultan tanto los niveles estándar como el porcentaje alternativo usado por algunos modelos Canon:
   - Descripción: `.6`
   - Porcentaje: `.7`
   - Máximo: `.8`
   - Nivel: `.9`
6. Los datos se guardan en PostgreSQL.
7. Si el tipo es multifunción, el mismo equipo se crea en ambas tablas.

## SNMP y consumibles

La lectura depende de que el equipo:

- Esté encendido y sea accesible desde el contenedor.
- Tenga SNMP habilitado.
- Permita la comunidad `public`.
- Exponga la tabla estándar de consumibles.

Algunos equipos devuelven `-2` en el nivel absoluto, pero sí devuelven porcentaje. Cuando el nivel actual y el máximo son válidos, el lector calcula `nivel / máximo`; si no, usa el porcentaje directo. Esto evita tomar un porcentaje obsoleto cuando los campos de nivel son más precisos.

La Canon TS3100 requiere una adaptación adicional: sus OID SNMP estándar pueden devolver `19%` para ambos depósitos aunque la interfaz web de Canon muestre valores diferentes. Para este modelo se consulta también `JS_MDL/model.js` en la interfaz web local de la impresora. Esa fuente informa el estado que muestra Canon, por ejemplo `0%` para un cartucho vacío y `70%` para el depósito de color. Si la interfaz web no está disponible, se conserva el valor SNMP como respaldo.

El nombre reportado por la impresora se conserva como modelo del consumible. Por ejemplo:

```text
Canon Black Ink Tank
Canon Color Ink Tank
```

## API principal

| Método | Ruta | Uso |
|---|---|---|
| `GET` | `/api/printers` | Lista impresoras |
| `POST` | `/api/printers` | Crea una impresora |
| `PUT` | `/api/printers/:id` | Actualiza una impresora |
| `DELETE` | `/api/printers/:id` | Elimina una impresora |
| `POST` | `/api/printers/:id/toner` | Refresca identidad y consumibles |
| `GET` | `/api/scanners` | Lista escáneres |
| `POST` | `/api/scanners` | Crea un escáner |
| `PUT` | `/api/scanners/:id` | Actualiza un escáner |
| `DELETE` | `/api/scanners/:id` | Elimina un escáner |
| `POST` | `/api/discover` | Descubre datos por IP |
| `GET` | `/api/backup?format=json` | Descarga JSON |
| `GET` | `/api/backup?format=sql` | Descarga SQL |

## Base de datos

PostgreSQL almacena:

- `Printer`: nombre, IP, marca, modelo, estado, multifunción y JSON de tóneres.
- `Scanner`: nombre, IP, marca, modelo, estado y multifunción.

El contenedor ejecuta `prisma db push` al iniciar para mantener el esquema sincronizado en el entorno de desarrollo.

## Ejecución con Docker

Desde la carpeta del proyecto:

```powershell
docker compose up --build -d
```

Panel web:

```text
http://localhost:3000
```

Ver estado:

```powershell
docker compose ps
```

Ver logs:

```powershell
docker compose logs -f printer-app
```

Detener servicios:

```powershell
docker compose down
```

## Desarrollo local

Requisitos:

- Node.js 20 o superior.
- PostgreSQL, o el servicio PostgreSQL de Docker.
- SNMP habilitado en los dispositivos.

Instalar dependencias y ejecutar:

```powershell
npm install
npm run dev
```

Comandos disponibles:

```text
npm run dev       # Servidor Next.js de desarrollo
npm run build     # Build de producción
npm run start     # Servidor de producción
npm run lint      # ESLint
```

## Variables de entorno

La aplicación requiere `DATABASE_URL`, por ejemplo:

```text
DATABASE_URL=postgresql://postgres:password@localhost:5432/printerdb?schema=public
```

Dentro de Docker, el host de PostgreSQL es `postgres`:

```text
DATABASE_URL=postgresql://postgres:password@postgres:5432/printerdb?schema=public
```

## Limitaciones conocidas

- SNMPv3 y comunidades SNMP distintas de `public` todavía no tienen configuración desde la interfaz.
- El nombre de modelo del cartucho depende de la descripción que publique el fabricante por SNMP.
- La aplicación no envía comandos de apagado ni reinicio; esas operaciones dependen del fabricante y se retiraron para evitar mostrar acciones que no son confiables.
- El estado activa/apagada se administra desde la aplicación y no es un ping automático continuo.
