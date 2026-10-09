import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Context = { params: Promise<{ id: string }> };

function getId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PUT(request: Request, { params }: Context) {
  try {
    const id = getId((await params).id);
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    const body = await request.json();
    const { name, ip, brand, model, active, isMultifunction } = body;
    if (!name || !ip || !brand) {
      return NextResponse.json({ error: 'Nombre, IP y marca son obligatorios' }, { status: 400 });
    }
    const scanner = await prisma.scanner.update({
      where: { id },
      data: { name, ip, brand, model: model || null, active: active !== false, isMultifunction: isMultifunction === true },
    });
    return NextResponse.json(scanner);
  } catch (error) {
    return NextResponse.json({ error: 'No se pudo actualizar el escáner (IP existente o registro no encontrado)' }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  try {
    const id = getId((await params).id);
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    await prisma.scanner.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'No se pudo eliminar el escáner' }, { status: 400 });
  }
}
