export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const nicho = searchParams.get('nicho');
    const estado = searchParams.get('estado');
    const fuente = searchParams.get('fuente');
    const search = searchParams.get('search');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {};
    if (nicho) where.nicho = nicho;
    if (estado) where.estado = estado;
    if (fuente) where.fuente = fuente;

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        where.createdAt.lte = toDate;
      }
    }

    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { empresa: { contains: search, mode: 'insensitive' } },
        { telefono: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.lead.count({ where }),
    ]);

    // Get unique nichos for filter dropdown
    const nichos = await prisma.lead.findMany({
      select: { nicho: true },
      distinct: ['nicho'],
      where: { nicho: { not: null } },
    });

    return NextResponse.json({
      leads: leads ?? [],
      nichos: nichos.map((n: any) => n.nicho).filter(Boolean),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get leads error:', error);
    return NextResponse.json({ error: 'Error al obtener leads' }, { status: 500 });
  }
}
