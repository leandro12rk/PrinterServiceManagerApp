import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const scanners = await prisma.scanner.findMany();
    return NextResponse.json(scanners);
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