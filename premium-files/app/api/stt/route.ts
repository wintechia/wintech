export const dynamic = 'force-dynamic';

const DEEPGRAM_KEY = 'process.env.DEEPGRAM_API_KEY || ''';

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';

    let audioBuffer: ArrayBuffer;

    if (contentType.includes('audio/')) {
      audioBuffer = await request.arrayBuffer();
    } else {
      const body = await request.json();
      if (body.audio) {
        // Base64 encoded audio
        const base64 = body.audio.split(',')[1] || body.audio;
        const binary = Buffer.from(base64, 'base64');
        audioBuffer = binary.buffer.slice(binary.byteOffset, binary.byteOffset + binary.byteLength);
      } else {
        return Response.json({ error: 'No audio data provided' }, { status: 400 });
      }
    }

    if (!audioBuffer || audioBuffer.byteLength === 0) {
      return Response.json({ error: 'Empty audio data' }, { status: 400 });
    }

    const response = await fetch(
      'https://api.deepgram.com/v1/listen?model=nova-2&language=es&smart_format=true&punctuate=true',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'audio/webm',
          'Authorization': `Token ${DEEPGRAM_KEY}`,
        },
        body: Buffer.from(audioBuffer),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Deepgram STT error:', errorText);
      return Response.json({ error: 'STT service unavailable' }, { status: 500 });
    }

    const data = await response.json();
    const transcript = data?.results?.[0]?.channels?.[0]?.alternatives?.[0]?.transcript || '';

    return Response.json({ transcript });
  } catch (error: any) {
    console.error('STT API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
