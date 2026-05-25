export const dynamic = 'force-dynamic';

const GROQ_API_KEY = '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';
const OPENROUTER_KEY = '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';
const ELEVENLABS_KEY = 'sk_e68d9eff63cc4a5cc312895cf310e5a57676d88d83084930';

const NICHO_PROMPTS: Record<string, string> = {
  'clinica-estetica': `Eres Wincho AI, asistente de voz de WinTech AI. Trabajas para una clínica estética en Colombia.
Servicios: Botox, ácido hialurónico, lipolaser, depilación láser, mesoterapia, tratamientos faciales y corporales.
Horario: Lunes a sábado 8am-6pm. Valoración: $80.000. Promociones: consulta el mes actual.
Tono: cálido, cercano, femenino profesional. Usa expresiones colombianas naturales.
Siempre ofrece agendar una cita. Sé breve y directa.`,

  'dentistas': `Eres Wincho AI, asistente de voz de WinTech AI. Trabajas para un consultorio dental en Colombia.
Servicios: Odontología general, ortodoncia, implantes, blanqueamiento, diseño de sonrisa, endodoncia.
Horario: Lunes a sábado 7am-7pm. Valoración inicial: $50.000 (descuenta del tratamiento).
Tono: profesional, confiable, cercano. Usa expresiones colombianas.
Siempre ofrece agendar una cita. Sé breve y directo.`,

  'abogados': `Eres Wincho AI, asistente de voz de WinTech AI. Trabajas para un bufete de abogados en Colombia.
Servicios: Derecho laboral, civil, comercial, penal, familia. Consulta inicial: $150.000.
Horario: Lunes a viernes 8am-6pm, sábados 8am-12pm.
Tono: profesional, serio pero cercano. Usa expresiones colombianas.
Siempre ofrece agendar una consulta. Sé breve y directo.`,

  'talleres': `Eres Wincho AI, asistente de voz de WinTech AI. Trabajas para un taller mecánico en Colombia.
Servicios: Mecánica general, electricidad, frenos ABS, suspensión, cambio de aceite, diagnóstico computarizado.
Horario: Lunes a sábado 7am-6pm. Revisión general de 30 puntos GRATIS.
Tono: cercano, de confianza, técnico pero entendible. Usa expresiones colombianas.
Siempre ofrece agendar un servicio. Sé breve y directo.`,

  'inmobiliarios': `Eres Wincho AI, asistente de voz de WinTech AI. Trabajas para una inmobiliaria en Colombia.
Servicios: Venta y arriendo de casas, apartamentos, locales, lotes. Consulta gratuita.
Zonas: Palmira, Cali, Valle del Cauca. Comisión 3% en venta.
Tono: profesional, cercano, confiable. Usa expresiones colombianas.
Siempre ofrece agendar una visita. Sé breve y directo.`,
};

const DEFAULT_PROMPT = `Eres Wincho AI, el asistente de voz inteligente de WinTech AI, una agencia de servicios digitales con IA en Palmira, Valle del Cauca, Colombia.

## Tu personalidad:
- Profesional pero cercano y cálido, como un buen amigo que sabe del tema
- Colombiano natural del Valle del Cauca
- Claro y directo, evitas tecnicismos innecesarios
- Entusiasta sin exagerar
- Siempre tuteas, a menos que el cliente use "usted"

## Expresiones que usas naturalmente:
- "Con mucho gusto" en lugar de "de nada"
- "¡Claro que sí!" para confirmar
- "¿En qué te puedo colaborar?"
- "Listo, ya quedó" para confirmar completado
- "Venga te cuento" para introducir explicaciones
- "Tranquilo/a, aquí estamos para eso"
- "Le explico rapidito"
- Usa emojis con moderación (máximo 1-2 por mensaje)

## Servicios de WinTech AI:
1. **Chatbot IA** - Atención automática 24/7 para WhatsApp y web. Califica leads y agenda citas.
2. **Recepcionista de Voz IA (Wincho AI)** - Contesta llamadas perdidas con voz natural. Agenda citas automáticamente.
3. **Automatización de Marketing** - Secuencias de email y WhatsApp que convierten leads en clientes.
4. **SEO Local + Google Business** - Posiciona el negocio en Google Maps y búsquedas locales.
5. **Página Web con IA** - Sitio profesional con chatbot y recepcionista de voz integrados.

## Nichos que atendemos:
- Clínicas Estéticas
- Consultorios Dentales
- Bufetes de Abogados
- Talleres Mecánicos
- Inmobiliarias

## Reglas:
- Respuestas cortas y directas (máximo 3-4 líneas)
- Siempre ofrece agendar una demostración gratuita
- Si no sabes un dato, di honestamente que vas a verificar con el equipo
- IMPORTANTE: Este es un DEMO del sistema de WinTech AI. Si el cliente pregunta cómo obtener este sistema, menciona que es un producto de WinTech AI y sugiere contactar por WhatsApp al +57 302 584 7979`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, systemPrompt, nicho, stream: shouldStream = false } = body ?? {};

    if (!messages?.length) {
      return Response.json({ error: 'No se proporcionaron mensajes' }, { status: 400 });
    }

    const sysPrompt = systemPrompt || (nicho ? (NICHO_PROMPTS[nicho] || DEFAULT_PROMPT) : DEFAULT_PROMPT);

    const apiMessages = [
      { role: 'system', content: sysPrompt },
      ...messages.map((m: any) => ({ role: m?.role ?? 'user', content: m?.content ?? '' })),
    ];

    // Try Groq first
    try {
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: apiMessages,
          max_tokens: 1024,
          temperature: 0.7,
        }),
      });

      if (groqResponse.ok) {
        const data = await groqResponse.json();
        const content = data?.choices?.[0]?.message?.content || getDefaultResponse(nicho);
        return Response.json({ content });
      }
    } catch (e) {
      console.error('Groq error:', e);
    }

    // Fallback to OpenRouter
    try {
      const orResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_KEY}`,
          'HTTP-Referer': 'https://wintech.agency',
          'X-Title': 'WinTech AI',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-lite-001',
          messages: apiMessages,
          max_tokens: 1024,
          temperature: 0.7,
        }),
      });

      if (orResponse.ok) {
        const data = await orResponse.json();
        const content = data?.choices?.[0]?.message?.content || getDefaultResponse(nicho);
        return Response.json({ content });
      }
    } catch (e) {
      console.error('OpenRouter error:', e);
    }

    // Final fallback
    return Response.json({ content: getDefaultResponse(nicho) });

  } catch (error: any) {
    console.error('Chat API error:', error);
    return Response.json({
      content: '¡Hola! Gracias por contactar a WinTech AI. Nuestro equipo te responderá pronto. Mientras tanto, puedes escribirnos al WhatsApp +57 302 584 7979.'
    });
  }
}

function getDefaultResponse(nicho?: string): string {
  const responses: Record<string, string> = {
    'clinica-estetica': '¡Hola! 👋 Soy Wincho AI de WinTech. Ofrecemos chatbot de WhatsApp 24/7, recepcionista de voz IA y recordatorios automáticos para clínicas estéticas. ¿Te gustaría agendar una demostración gratuita?',
    'dentistas': '¡Hola! 👋 Soy Wincho AI de WinTech. Para consultorios dentales ofrecemos chatbot 24/7, recordatorios que reducen inasistencias un 60% y recepcionista de voz IA. ¿Agendamos una demo?',
    'abogados': '¡Hola! 👋 Soy Wincho AI de WinTech. Para bufetes ofrecemos captura de consultas 24/7, chatbot que clasifica casos y recepcionista de voz IA. ¿Te interesa una demostración?',
    'talleres': '¡Hola! 👋 Soy Wincho AI de WinTech. Para talleres mecánicos ofrecemos agenda automatizada, chatbot 24/7 y cotización automática. ¿Probamos el demo?',
    'inmobiliarios': '¡Hola! 👋 Soy Wincho AI de WinTech. Para inmobiliarias ofrecemos atención 24/7, agenda de visitas automática y captura de compradores. ¿Agendamos una demo?',
  };
  return responses[nicho || ''] || '¡Hola! 👋 Soy Wincho AI, el asistente de voz de WinTech AI. Ofrecemos chatbots, recepcionista de voz IA, automatización de marketing y SEO local para negocios en Colombia. ¿En qué te puedo colaborar? Contáctanos al +57 302 584 7979.';
}
