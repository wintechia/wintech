export const dynamic = 'force-dynamic';
import { WINTECH_SYSTEM_PROMPT, getNichoChatPrompt } from '@/lib/chatbot-system-prompt';

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

    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.ABACUSAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-5.4-mini',
        messages: apiMessages,
        stream: true,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response?.ok) {
      const errText = await response?.text?.() ?? 'Unknown error';
      console.error('LLM API error:', errText);
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
