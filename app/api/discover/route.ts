import { NextResponse } from 'next/server';
import { discoverDevice } from '@/lib/snmp-discovery';

export async function POST(request: Request) {
  try {
    const { ip } = await request.json();
    if (!ip || typeof ip !== 'string') {
      return NextResponse.json({ error: 'La dirección IP es obligatoria' }, { status: 400 });
    }
    const discovered = await discoverDevice(ip.trim());
    return NextResponse.json({ ip: ip.trim(), ...discovered });
  } catch (error) {
    return NextResponse.json({
      error: 'No se pudo consultar el dispositivo por SNMP. Verifica la IP, que esté encendido y que la comunidad SNMP sea "public".',
    }, { status: 422 });
  }
}
