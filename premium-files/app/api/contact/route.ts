export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';
import { notifyNewLead, sendWelcomeEmail } from './email';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { nombre, email, telefono, empresa, nicho, planInteres, mensaje, fuente } = data ?? {};

    if (!nombre || !email) {
      return Response.json({ error: 'Nombre y email son requeridos' }, { status: 400 });
    }

    // Save lead to database
    let lead;
    try {
      lead = await prisma.lead.create({
        data: {
          nombre,
          email,
          telefono: telefono || null,
          empresa: empresa || null,
          nicho: nicho || null,
          planInteres: planInteres || null,
          mensaje: mensaje || null,
          fuente: fuente || 'contacto',
          estado: 'nuevo',
        },
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue even if DB fails - still send emails
    }

    // Send notification to admin (fire and forget)
    notifyNewLead({ nombre, email, telefono, nicho, mensaje, fuente }).catch(console.error);

    // Send welcome email to lead (fire and forget)
    sendWelcomeEmail({ nombre, email, nicho }).catch(console.error);

    return Response.json({ success: true, id: lead?.id });
  } catch (error: any) {
    console.error('Contact error:', error);
    return Response.json({ error: 'Error al procesar el contacto' }, { status: 500 });
  }
}
