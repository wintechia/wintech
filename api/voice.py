from fastapi import FastAPI, UploadFile
from pydantic import BaseModel
import os, httpx

app = FastAPI()

class SpeechRequest(BaseModel):
    text: str

@app.post("/stt")
async def stt(file: UploadFile):
    # Placeholder for Whisper STT
    return {"text": "transcribed text"}

@app.post("/tts")
async def tts(req: SpeechRequest):
    # Placeholder for TTS
    return {"audio_url": "https://example.com/audio.mp3"}

@app.post("/assistant")
async def assistant(req: SpeechRequest):
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://api.anthropic.com/v1/messages",
            headers={"x-api-key": os.getenv("ANTHROPIC_API_KEY")},
            json={"model":"claude-3-haiku-20240307","max_tokens":1024,"messages":[{"role":"user","content":req.text}]}
        )
        return resp.json()
