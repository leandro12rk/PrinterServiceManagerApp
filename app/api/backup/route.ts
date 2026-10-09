import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function sqlString(value: unknown) {
  if (value === null || value === undefined) return 'NULL';
  return `'${String(value).replace(/'/g, "''")}'`;
}

export async function GET(request: Request) {
  try {
    const format = new URL(request.url).searchParams.get('format') || 'json';
    const [printers, scanners] = await Promise.all([
      prisma.printer.findMany(),
      prisma.scanner.findMany(),
    ]);
    const stamp = Date.now();
    if (format === 'sql') {
      const lines = [
        '-- Data registrada del Printer Service Manager',
        '-- Creado por: leandrork12',
        'BEGIN;',
        'DELETE FROM "Printer";',
        'DELETE FROM "Scanner";',
        ...printers.map((device) =>
          `INSERT INTO "Printer" ("id","name","ip","brand","model","type","active","isMultifunction","toners","createdAt") VALUES (${device.id},${sqlString(device.name)},${sqlString(device.ip)},${sqlString(device.brand)},${sqlString(device.model)},${sqlString(device.type)},${device.active},${device.isMultifunction},${sqlString(device.toners ? JSON.stringify(device.toners) : null)}::jsonb,${sqlString(device.createdAt.toISOString())});`),
        ...scanners.map((device) =>
          `INSERT INTO "Scanner" ("id","name","ip","brand","model","active","isMultifunction","createdAt") VALUES (${device.id},${sqlString(device.name)},${sqlString(device.ip)},${sqlString(device.brand)},${sqlString(device.model)},${device.active},${device.isMultifunction},${sqlString(device.createdAt.toISOString())});`),
        'COMMIT;',
      ];
      return new NextResponse(lines.join('\n'), {
        headers: {
          'Content-Type': 'application/sql; charset=utf-8',
          'Content-Disposition': `attachment; filename="data-registrada-${stamp}.sql"`,
        },
      });
    }
    const content = {
      application: 'Printer Service Manager',
      generatedAt: new Date().toISOString(),
      data: { printers, scanners },
    };
    return new NextResponse(JSON.stringify(content, null, 2), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="data-registrada-${stamp}.json"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error al generar la data registrada' }, { status: 500 });
  }
}
