export const dynamic = 'force-dynamic';

const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY || '';

// Spanish female voices in ElevenLabs
// "Jessica" (EXAVITQu4vr4xnSDxMaL) - warm, professional female
// "Rachel" (21m0v06aSE2XPYSJQVjwR) - calm, professional
// Using a Spanish-optimized voice
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Jessica - warm professional female

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return Response.json({ error: 'No text provided' }, { status: 400 });
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.3,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs TTS error:', errorText);
      return Response.json({ error: 'TTS service unavailable' }, { status: 500 });
    }

    const audioBuffer = await response.arrayBuffer();
    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: any) {
    console.error('TTS API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
