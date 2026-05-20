export const dynamic = 'force-dynamic';
import { WINTECH_SYSTEM_PROMPT, getNichoChatPrompt } from '@/lib/chatbot-system-prompt';

// OpenRouter free models - prioritized by capability
const FREE_MODEL = 'openrouter/free'; // Auto-selects best free model

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, systemPrompt, nicho, sessionId } = body ?? {};

    if (!(messages?.length)) {
      return new Response(JSON.stringify({ error: 'No messages provided' }), { status: 400 });
    }

    let sysPrompt = systemPrompt ?? WINTECH_SYSTEM_PROMPT;
    if (nicho && !systemPrompt) {
      sysPrompt = getNichoChatPrompt(nicho);
    }

    const apiMessages = [
      { role: 'system', content: sysPrompt },
      ...(messages ?? []).map((m: any) => ({ role: m?.role ?? 'user', content: m?.content ?? '' })),
    ];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://wintech.agency',
        'X-Title': 'WinTech AI Agency',
      },
      body: JSON.stringify({
        model: FREE_MODEL,
        messages: apiMessages,
        stream: true,
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response?.ok) {
      const errText = await response?.text?.() ?? 'Unknown error';
      console.error('OpenRouter API error:', errText);
      return new Response(JSON.stringify({ error: 'Error al procesar la solicitud' }), { status: 500 });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response?.body?.getReader();
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        try {
          while (reader) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder?.decode?.(value) ?? '';
            controller.enqueue(encoder.encode(chunk));
          }
        } catch (error: any) {
          console.error('Stream error:', error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500 });
  }
}
