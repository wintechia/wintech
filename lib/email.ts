/**
 * Email service for WinTech AI
 * Uses Resend API for transactional emails
 * Can be imported by API routes and server actions
 */

const RESEND_KEY = process.env.RESEND_API_KEY || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'WinTech AI <hola@wintech.agency>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'wintech.ia@gmail.com';

interface EmailData {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

async function sendEmail({ to, subject, html, replyTo }: EmailData) {
  if (!RESEND_KEY) {
    console.warn('RESEND_API_KEY not configured, email not sent');
    return { success: false, error: 'No API key' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        reply_to: replyTo || ADMIN_EMAIL,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend error:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (err) {
    console.error('Email send error:', err);
    return { success: false, error: String(err) };
  }
}

// Send lead notification to admin
export async function notifyNewLead(lead: {
  nombre: string;
  email: string;
  telefono?: string;
  nicho?: string;
  mensaje?: string;
  fuente?: string;
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0A2463, #3BCEAC); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">🚨 Nuevo Lead - WinTech AI</h1>
      </div>
      <div style="padding: 20px; background: #f9fafb;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Nombre:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${lead.nombre}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${lead.email}</td></tr>
          ${lead.telefono ? `<tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Teléfono:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${lead.telefono}</td></tr>` : ''}
          ${lead.nicho ? `<tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Nicho:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${lead.nicho}</td></tr>` : ''}
          ${lead.fuente ? `<tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Fuente:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${lead.fuente}</td></tr>` : ''}
          ${lead.mensaje ? `<tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Mensaje:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${lead.mensaje}</td></tr>` : ''}
        </table>
      </div>
    </div>
  `;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `🚨 Nuevo Lead: ${lead.nombre} (${lead.nicho || 'Sin nicho'})`,
    html: html.trim(),
    replyTo: lead.email,
  });
}

// Send welcome email to new lead
export async function sendWelcomeEmail(lead: {
  nombre: string;
  email: string;
  nicho?: string;
}) {
  const nichoDisplay = lead.nicho
    ? lead.nicho.charAt(0).toUpperCase() + lead.nicho.slice(1).replace(/-/g, ' ')
    : 'tu negocio';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0A2463, #3BCEAC); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">¡Bienvenido a WinTech AI!</h1>
      </div>
      <div style="padding: 30px; background: #ffffff;">
        <p>Hola <strong>${lead.nombre}</strong>,</p>
        <p>Gracias por tu interés en transformar ${nichoDisplay} con Inteligencia Artificial.</p>
        <p>En las próximas horas uno de nuestres especialistas se contactará contigo para:</p>
        <ul>
          <li>🎯 Conocer tus necesidades específicas</li>
          <li>📊 Analizar cómo la IA puede impulsar tu negocio</li>
          <li>🚀 Agendar una demo personalizada GRATIS</li>
        </ul>
        <p>Mientras tanto, visita nuestra página: <a href="https://wintech.agency">wintech.agency</a></p>
      </div>
    </div>
  `;

  return sendEmail({
    to: lead.email,
    subject: `¡Bienvenido a WinTech AI, ${lead.nombre}!`,
    html: html.trim(),
  });
}

// Send demo credentials to lead
export async function sendDemoCredentials(data: {
  nombre: string;
  email: string;
  nicho: string;
  demoUrl: string;
  expiresAt: string;
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0A2463, #3BCEAC); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">🎉 Tu Demo está Lista</h1>
      </div>
      <div style="padding: 30px; background: #ffffff;">
        <p>Hola <strong>${data.nombre}</strong>,</p>
        <p>Tu demo personalizada para <strong>${data.nicho}</strong> está lista.</p>
        <div style="background: #f0f9ff; border: 2px solid #3BCEAC; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
          <a href="${data.demoUrl}" style="display: inline-block; background: #0A2463; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-size: 18px;">
            🚀 Ver Mi Demo
          </a>
          <p style="margin-top: 15px; color: #6b7280; font-size: 14px;">
            Expira: ${data.expiresAt}
          </p>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: data.email,
    subject: `🎉 Tu Demo de WinTech AI está lista`,
    html: html.trim(),
  });
}

export { sendEmail };
