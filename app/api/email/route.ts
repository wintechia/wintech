export const dynamic = 'force-dynamic';

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
          <tr><td style="padding: 8px; font-weight: bold;">Nombre:</td><td style="padding: 8px;">${lead.nombre}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${lead.email}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Teléfono:</td><td style="padding: 8px;">${lead.telefono || 'No proporcionado'}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Nicho:</td><td style="padding: 8px;">${lead.nicho || 'No especificado'}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Fuente:</td><td style="padding: 8px;">${lead.fuente || 'web'}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Mensaje:</td><td style="padding: 8px;">${lead.mensaje || 'Sin mensaje'}</td></tr>
        </table>
        <div style="margin-top: 20px; text-align: center;">
          <a href="https://wintech.agency/admin" style="background: #3BCEAC; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Ver en Admin</a>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `🚨 Nuevo Lead: ${lead.nombre} (${lead.nicho || 'Sin nicho'})`,
    html,
    replyTo: lead.email,
  });
}

// Send welcome email to lead
export async function sendWelcomeEmail(lead: {
  nombre: string;
  email: string;
  nicho?: string;
}) {
  const nichoNames: Record<string, string> = {
    'clinica-estetica': 'Clínicas Estéticas',
    'dentistas': 'Consultorios Dentales',
    'abogados': 'Bufetes de Abogados',
    'talleres': 'Talleres Mecánicos',
    'inmobiliarios': 'Inmobiliarias',
  };

  const nichoName = nichoNames[lead.nicho || ''] || 'tu negocio';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0A2463, #3BCEAC); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">¡Hola ${lead.nombre}! 👋</h1>
        <p style="color: rgba(255,255,255,0.9); margin-top: 10px;">Gracias por tu interés en WinTech AI</p>
      </div>
      <div style="padding: 30px; background: #ffffff;">
        <p style="font-size: 16px; color: #333;">¡Qué alegría que nos contactaras! 🙌</p>
        <p style="font-size: 16px; color: #333;">Vimos que estás interesado en nuestras soluciones de IA para <strong>${nichoName}</strong>.</p>
        
        <div style="background: #f0f7ff; border-left: 4px solid #3BCEAC; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #555;">En las próximas horas un especialista de nuestro equipo se comunicará contigo para agendar una <strong>demostración gratuita</strong> de cómo nuestra IA puede multiplicar tus ventas.</p>
        </div>

        <h3 style="color: #0A2463;">Mientras tanto, descubre lo que hacemos:</h3>
        <ul style="color: #555; line-height: 1.8;">
          <li>🤖 <strong>Chatbot IA 24/7</strong> - Atiende WhatsApp y tu web automáticamente</li>
          <li>🎙️ <strong>Recepcionista de Voz IA</strong> - Nunca pierdas una llamada</li>
          <li>📧 <strong>Automatización de Marketing</strong> - Convierte leads en clientes</li>
          <li>🔍 <strong>SEO Local</strong> - Aparece primero en Google Maps</li>
        </ul>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://wintech.agency/demo" style="background: linear-gradient(135deg, #0A2463, #3BCEAC); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Ver Demo en Vivo</a>
        </div>

        <p style="font-size: 14px; color: #888; text-align: center;">
          ¿Preguntas? Escríbenos al WhatsApp: <a href="https://wa.me/573025847979" style="color: #3BCEAC;">+57 302 584 7979</a>
        </p>
      </div>
      <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #999;">WinTech AI - Palmira, Valle del Cauca, Colombia</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: lead.email,
    subject: `${lead.nombre}, tu demo de IA te está esperando 🚀`,
    html,
  });
}

// Send demo credentials to client
export async function sendDemoCredentials(data: {
  nombre: string;
  email: string;
  demoUrl: string;
  expiresAt: string;
  nicho: string;
  negocio: string;
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0A2463, #3BCEAC); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">🎉 ¡Tu Demo está Lista!</h1>
        <p style="color: rgba(255,255,255,0.9);">${data.negocio}</p>
      </div>
      <div style="padding: 30px;">
        <p>Hola ${data.nombre},</p>
        <p>Tu sitio web con IA personalizada está listo para que lo explores. 🚀</p>
        
        <div style="background: #f0f7ff; border: 2px dashed #3BCEAC; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
          <p style="margin: 0 0 10px; font-size: 14px; color: #666;">URL de tu demo:</p>
          <a href="${data.demoUrl}" style="font-size: 18px; font-weight: bold; color: #0A2463; word-break: break-all;">${data.demoUrl}</a>
          <p style="margin: 10px 0 0; font-size: 12px; color: #e74c3c;">⏰ Expira: ${data.expiresAt}</p>
        </div>

        <h3>¿Qué incluye tu demo?</h3>
        <ul>
          <li>✅ Página web profesional personalizada para ${data.nicho}</li>
          <li>✅ Chatbot de IA integrado (pruébalo ahora)</li>
          <li>✅ Recepcionista de voz IA</li>
          <li>✅ Formulario de captura de leads</li>
          <li>✅ Diseño responsive (móvil y escritorio)</li>
        </ul>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.demoUrl}" style="background: linear-gradient(135deg, #0A2463, #3BCEAC); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">Explorar Mi Demo</a>
        </div>

        <p style="font-size: 14px; color: #666;">¿Quieres activar tu plan? Escríbenos al <a href="https://wa.me/573025847979">WhatsApp</a></p>
      </div>
    </div>
  `;

  return sendEmail({
    to: data.email,
    subject: `🎉 ${data.nombre}, tu demo de ${data.negocio} está lista`,
    html,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    let result;
    switch (type) {
      case 'new-lead':
        result = await notifyNewLead(data);
        break;
      case 'welcome':
        result = await sendWelcomeEmail(data);
        break;
      case 'demo-credentials':
        result = await sendDemoCredentials(data);
        break;
      default:
        return Response.json({ error: 'Unknown email type' }, { status: 400 });
    }

    return Response.json(result);
  } catch (error: any) {
    console.error('Email API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
