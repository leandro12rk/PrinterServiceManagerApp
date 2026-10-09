import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { discoverDevice } from '@/lib/snmp-discovery';

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number((await params).id);
    if (!Number.isInteger(id) || id < 1) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    const printer = await prisma.printer.findUnique({ where: { id } });
    if (!printer) return NextResponse.json({ error: 'Impresora no encontrada' }, { status: 404 });

    const discovered = await discoverDevice(printer.ip);
    const updated = await prisma.printer.update({
      where: { id },
      data: {
        name: discovered.name,
        brand: discovered.brand,
        model: discovered.model,
        toners: discovered.toners,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({
      error: 'No se pudo consultar el tóner. Verifica que la impresora esté encendida y que SNMP esté habilitado.',
    }, { status: 422 });
  }
}
