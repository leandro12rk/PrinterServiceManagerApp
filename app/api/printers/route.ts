import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { discoverDevice } from '@/lib/snmp-discovery';

export async function GET() {
  try {
    const printers = await prisma.printer.findMany();
    const synchronizedPrinters = await Promise.all(printers.map(async (printer) => {
      let active = false;
      try {
        await discoverDevice(printer.ip);
        active = true;
      } catch {
        active = false;
      }

      if (active !== printer.active) {
        return prisma.printer.update({
          where: { id: printer.id },
          data: { active },
        });
      }

      return printer;
    }));
    return NextResponse.json(synchronizedPrinters);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener impresoras' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, ip, brand, model, active, toners, isMultifunction } = body;
    if (!name || !ip || !brand) {
      return NextResponse.json({ error: 'Nombre, IP y marca son obligatorios' }, { status: 400 });
    }
    const newPrinter = await prisma.printer.create({
      data: { name, ip, brand, model: model || null, active: active !== false, toners: toners || undefined, isMultifunction: isMultifunction === true }
    });
    return NextResponse.json(newPrinter);
  } catch (error) {
    return NextResponse.json({ error: 'No se pudo registrar (IP existente)' }, { status: 400 });
  }
}