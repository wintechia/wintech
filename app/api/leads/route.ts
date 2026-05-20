export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { nombre, email, telefono, empresa, nicho, planInteres, mensaje, fuente } = data ?? {};

    if (!nombre || !email) {
      return NextResponse.json({ error: 'Nombre y email son requeridos' }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        nombre: nombre ?? '',
        email: email ?? '',
        telefono: telefono ?? null,
        empresa: empresa ?? null,
        nicho: nicho ?? null,
        planInteres: planInteres ?? null,
        mensaje: mensaje ?? null,
        fuente: fuente ?? 'contacto',
        estado: 'nuevo',
      },
    });

    return NextResponse.json({ success: true, id: lead?.id });
  } catch (error: any) {
    console.error('Lead creation error:', error);
    return NextResponse.json({ error: 'Error al guardar el lead' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ leads: leads ?? [] });
  } catch (error: any) {
    console.error('Get leads error:', error);
    return NextResponse.json({ error: 'Error al obtener leads' }, { status: 500 });
  }
}
