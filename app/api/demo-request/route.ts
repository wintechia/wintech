export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { nombre, email, telefono, empresa, nicho } = data ?? {};

    if (!nombre || !email) {
      return NextResponse.json({ error: 'Nombre y email requeridos' }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        nombre: nombre ?? '',
        email: email ?? '',
        telefono: telefono ?? null,
        empresa: empresa ?? null,
        nicho: nicho ?? null,
        planInteres: null,
        mensaje: `Solicitud de demo - Nicho: ${nicho ?? 'No especificado'}`,
        fuente: 'demo',
        estado: 'nuevo',
      },
    });

    const appUrl = process.env.NEXTAUTH_URL ?? '';
    let senderEmail = 'noreply@wintech.agency';
    try { senderEmail = `noreply@${new URL(appUrl).hostname}`; } catch {}

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0A2463; border-bottom: 2px solid #FF6B35; padding-bottom: 10px;">🚨 Nueva Solicitud de Demo</h2>
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Nombre:</strong> ${nombre ?? ''}</p>
          <p><strong>Email:</strong> ${email ?? ''}</p>
          ${telefono ? `<p><strong>Teléfono:</strong> ${telefono}</p>` : ''}
          ${empresa ? `<p><strong>Empresa:</strong> ${empresa}</p>` : ''}
          <p><strong>Nicho/Demo:</strong> ${nicho ?? 'No especificado'}</p>
        </div>
      </div>
    `;

    await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deployment_token: process.env.ABACUSAI_API_KEY,
        app_id: process.env.WEB_APP_ID,
        notification_id: process.env.NOTIF_ID_SOLICITUD_DEMO,
        subject: `🚨 Solicitud de Demo: ${nombre ?? ''} (${nicho ?? ''})`,
        body: htmlBody,
        is_html: true,
        recipient_email: 'wintech.ia@gmail.com',
        reply_to: email ?? '',
        sender_email: senderEmail,
        sender_alias: 'WinTech AI',
      }),
    }).catch((err: any) => console.error('Demo notification error:', err));

    return NextResponse.json({ success: true, id: lead?.id });
  } catch (error: any) {
    console.error('Demo request error:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}
