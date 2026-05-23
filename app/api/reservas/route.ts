import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/reservas - Listar reservas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const nicho = searchParams.get('nicho');
    const estado = searchParams.get('estado');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {};
    if (nicho) where.nicho = nicho;
    if (estado) where.estado = estado;

    const [reservas, total] = await Promise.all([
      prisma.reserva.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.reserva.count({ where }),
    ]);

    return NextResponse.json({
      reservas,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching reservas:', error);
    return NextResponse.json({ error: 'Error al obtener reservas' }, { status: 500 });
  }
}

// POST /api/reservas - Crear nueva reserva
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, email, telefono, empresa, nicho, servicio, fecha, hora, notas } = body;

    if (!nombre || !email || !nicho || !servicio || !fecha || !hora) {
      return NextResponse.json(
        { error: 'Campos requeridos: nombre, email, nicho, servicio, fecha, hora' },
        { status: 400 }
      );
    }

    const reserva = await prisma.reserva.create({
      data: {
        nombre,
        email,
        telefono: telefono || null,
        empresa: empresa || null,
        nicho,
        servicio,
        fecha: fecha,
        hora,
        notas: notas || null,
        estado: 'pendiente',
      },
    });

    return NextResponse.json(reserva, { status: 201 });
  } catch (error: any) {
    console.error('Error creating reserva:', error);
    return NextResponse.json({ error: 'Error al crear reserva' }, { status: 500 });
  }
}

// PATCH /api/reservas - Actualizar estado de reserva
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, estado } = body;

    if (!id || !estado) {
      return NextResponse.json({ error: 'ID y estado requeridos' }, { status: 400 });
    }

    const validEstados = ['pendiente', 'confirmada', 'cancelada', 'completada'];
    if (!validEstados.includes(estado)) {
      return NextResponse.json({ error: 'Estado inválido' }, { status: 400 });
    }

    const reserva = await prisma.reserva.update({
      where: { id },
      data: { estado },
    });

    return NextResponse.json(reserva);
  } catch (error: any) {
    console.error('Error updating reserva:', error);
    return NextResponse.json({ error: 'Error al actualizar reserva' }, { status: 500 });
  }
}

// DELETE /api/reservas - Eliminar reserva
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    await prisma.reserva.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting reserva:', error);
    return NextResponse.json({ error: 'Error al eliminar reserva' }, { status: 500 });
  }
}
