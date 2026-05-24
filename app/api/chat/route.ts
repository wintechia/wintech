export const dynamic = 'force-dynamic';
import { WINTECH_SYSTEM_PROMPT, getNichoChatPrompt } from '@/lib/chatbot-system-prompt';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, systemPrompt, nicho, stream: shouldStream } = body ?? {};

    if (!(messages?.length)) {
      return Response.json({ error: 'No messages provided' }, { status: 400 });
    }

    let sysPrompt = systemPrompt ?? WINTECH_SYSTEM_PROMPT;
    if (nicho && !systemPrompt) {
      sysPrompt = getNichoChatPrompt(nicho);
    }

    const apiMessages = [
      { role: 'system', content: sysPrompt },
      ...(messages ?? []).map((m: any) => ({ role: m?.role ?? 'user', content: m?.content ?? '' })),
    ];

    const useStreaming = shouldStream !== false;
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      // Return a helpful message if no API key is configured
      const fallbackResponses: Record<string, string> = {
        'clinica-estetica': '¡Hola! Soy Wincho AI de WinTech. Para clínicas estéticas ofrecemos: chatbot de WhatsApp 24/7, recepcionista de voz IA, recordatorios automáticos de citas y captura de leads desde Instagram. ¿Te gustaría agendar una demostración gratuita?',
        'dentistas': '¡Hola! Soy Wincho AI de WinTech. Para consultorios dentales ofrecemos: chatbot de WhatsApp 24/7, recordatorios inteligentes que reducen inasistencias un 60%, recepcionista de voz IA y automatización de seguimiento. ¿Te gustaría agendar una demostración gratuita?',
        'abogados': '¡Hola! Soy Wincho AI de WinTech. Para bufetes de abogados ofrecemos: captura de consultas urgentes 24/7, chatbot que clasifica casos potenciales, recepcionista de voz IA y automatización de seguimiento. ¿Te gustaría agendar una demostración gratuita?',
        'talleres': '¡Hola! Soy Wincho AI de WinTech. Para talleres mecánicos ofrecemos: agenda de servicios automatizada, recordatorios de mantenimiento, chatbot de WhatsApp 24/7 y cotización automática de servicios. ¿Te gustaría agendar una demostración gratuita?',
        'inmobiliarios': '¡Hola! Soy Wincho AI de WinTech. Para inmobiliarias ofrecemos: atención a consultas de propiedades 24/7, agenda de visitas automática, chatbot que captura datos de compradores y seguimiento automatizado. ¿Te gustaría agendar una demostración gratuita?',
      };
      
      const responseText = fallbackResponses[nicho ?? ''] ?? 
        '¡Hola! Soy Wincho AI, el asistente de voz de WinTech AI. Ofrecemos chatbots de WhatsApp 24/7, recepcionista de voz IA, automatización de marketing y SEO local para negocios en Colombia. ¿En qué te puedo colaborar? Contáctanos al +57 302 584 7979.';
      
      return Response.json({ content: responseText });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://wintech.agency',
        'X-Title': 'WinTech AI Agency',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-lite-001',
        messages: apiMessages,
        stream: useStreaming,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response?.ok) {
      const errText = await response?.text?.() ?? 'Unknown error';
      console.error('API error:', errText);
      // Return fallback response instead of error
      return Response.json({ 
        content: '¡Hola! Gracias por contactarnos. Nuestro equipo de WinTech AI te responderá pronto. Mientras tanto, puedes llamarnos al +57 302 584 7979.' 
      });
    }

    if (useStreaming) {
      const responseText = await response.text();
      return Response.json({ content: responseText });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content ?? 
      'Gracias por tu mensaje. Nuestro equipo te contactará pronto.';
    
    return Response.json({ content });

  } catch (error: any) {
    console.error('Chat API error:', error);
    return Response.json({ 
      content: '¡Hola! Gracias por contactar a WinTech AI. Por favor escríbenos al WhatsApp +57 302 584 7979 para una atención inmediata.' 
    });
  }
}
