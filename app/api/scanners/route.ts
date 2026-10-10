import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { discoverDevice } from '@/lib/snmp-discovery';

export async function GET() {
  try {
    const scanners = await prisma.scanner.findMany();
    const synchronizedScanners = await Promise.all(scanners.map(async (scanner) => {
      let active = false;
      try {
        await discoverDevice(scanner.ip);
        active = true;
      } catch {
        active = false;
      }

      if (active !== scanner.active) {
        return prisma.scanner.update({
          where: { id: scanner.id },
          data: { active },
        });
      }

      return scanner;
    }));
    return NextResponse.json(synchronizedScanners);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener escáneres' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, ip, brand, model, active, isMultifunction } = body;
    if (!name || !ip || !brand) {
      return NextResponse.json({ error: 'Nombre, IP y marca son obligatorios' }, { status: 400 });
    }
    const newScanner = await prisma.scanner.create({
      data: { name, ip, brand, model: model || null, active: active !== false, isMultifunction: isMultifunction === true }
    });
    return NextResponse.json(newScanner);
  } catch (error) {
    return NextResponse.json({ error: 'Error al registrar el escáner' }, { status: 400 });
  }
}