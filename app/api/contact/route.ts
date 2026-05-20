export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { nombre, email, telefono, empresa, nicho, planInteres, mensaje, fuente } = data ?? {};

    if (!nombre || !email || !mensaje) {
      return NextResponse.json({ error: 'Nombre, email y mensaje son requeridos' }, { status: 400 });
    }

    // Save as lead
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

    // Send email notification
    const appUrl = process.env.NEXTAUTH_URL ?? '';
    let appName = 'WinTech AI';
    try { appName = appUrl ? new URL(appUrl).hostname?.split?.('.')?.[0] ?? 'WinTech AI' : 'WinTech AI'; } catch {}

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0A2463; border-bottom: 2px solid #3BCEAC; padding-bottom: 10px;">Nuevo Contacto desde el Sitio Web</h2>
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 10px 0;"><strong>Nombre:</strong> ${nombre ?? ''}</p>
          <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email ?? ''}">${email ?? ''}</a></p>
          ${telefono ? `<p style="margin: 10px 0;"><strong>Teléfono:</strong> ${telefono}</p>` : ''}
          ${empresa ? `<p style="margin: 10px 0;"><strong>Empresa:</strong> ${empresa}</p>` : ''}
          ${nicho ? `<p style="margin: 10px 0;"><strong>Nicho:</strong> ${nicho}</p>` : ''}
          ${planInteres ? `<p style="margin: 10px 0;"><strong>Plan de Interés:</strong> ${planInteres}</p>` : ''}
          <p style="margin: 10px 0;"><strong>Mensaje:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #3BCEAC;">${mensaje ?? ''}</div>
        </div>
        <p style="color: #666; font-size: 12px;">Fuente: ${fuente ?? 'contacto'}</p>
      </div>
    `;

    let senderEmail = 'noreply@wintech.agency';
    try { senderEmail = `noreply@${new URL(appUrl).hostname}`; } catch {}

    await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deployment_token: process.env.ABACUSAI_API_KEY,
        app_id: process.env.WEB_APP_ID,
        notification_id: process.env.NOTIF_ID_FORMULARIO_DE_CONTACTO,
        subject: `Nuevo contacto: ${nombre ?? 'Sin nombre'}`,
        body: htmlBody,
        is_html: true,
        recipient_email: 'wintech.ia@gmail.com',
        reply_to: email ?? '',
        sender_email: senderEmail,
        sender_alias: 'WinTech AI',
      }),
    }).catch((err: any) => console.error('Email notification error:', err));

    return NextResponse.json({ success: true, id: lead?.id });
  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Error al enviar el formulario' }, { status: 500 });
  }
}
