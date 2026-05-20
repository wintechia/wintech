'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2, Minimize2, Mic, MicOff, Volume2 } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatbotWidgetProps {
  systemPrompt?: string;
  nicho?: string;
  greeting?: string;
}

export function ChatbotWidget({ systemPrompt, nicho, greeting }: ChatbotWidgetProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage?.getItem?.('wintech-chat-session');
      if (stored) return stored;
      const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
      sessionStorage?.setItem?.('wintech-chat-session', id);
      return id;
    }
    return 'server';
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const defaultGreeting = greeting ?? '¡Hola! 👋 Bienvenido/a a WinTech AI. Soy tu asistente digital. ¿En qué te puedo colaborar hoy? También puedes hablarme por voz usando el botón del micrófono 🎙️';

  // Check for speech recognition support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setVoiceSupported(true);
      }
      synthRef.current = window.speechSynthesis || null;
    }
  }, []);

  useEffect(() => {
    if (open && (messages?.length ?? 0) === 0) {
      setMessages([{ role: 'assistant', content: defaultGreeting }]);
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView?.({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef?.current?.focus?.();
  }, [open]);

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      if (synthRef.current) {
        try { synthRef.current.cancel(); } catch {}
      }
    };
  }, []);

  const speakText = useCallback((text: string) => {
    if (!synthRef.current) return;
    try {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-CO';
      utterance.rate = 1.05;
      utterance.pitch = 1;
      // Try to find a Spanish voice
      const voices = synthRef.current.getVoices();
      const spanishVoice = voices.find((v: SpeechSynthesisVoice) => v.lang.startsWith('es'));
      if (spanishVoice) utterance.voice = spanishVoice;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      synthRef.current.speak(utterance);
    } catch {
      setSpeaking(false);
    }
  }, []);

  const startListening = useCallback(() => {
    if (!voiceSupported || listening) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-CO';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event?.results?.[0]?.[0]?.transcript ?? '';
      if (transcript) {
        setInput(transcript);
      }
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  }, [voiceSupported, listening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setListening(false);
  }, []);

  const sendMessage = useCallback(async (overrideInput?: string) => {
    const text = overrideInput ?? input;
    const trimmed = text?.trim?.() ?? '';
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: trimmed };
    setMessages((prev: ChatMessage[]) => [...(prev ?? []), userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...(messages ?? []), userMsg]?.map((m: ChatMessage) => ({ role: m?.role, content: m?.content })),
          systemPrompt: systemPrompt ?? undefined,
          nicho: nicho ?? undefined,
          sessionId,
        }),
      });

      if (!response?.ok) throw new Error('Error en la respuesta');

      const reader = response?.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      setMessages((prev: ChatMessage[]) => [...(prev ?? []), { role: 'assistant', content: '' }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder?.decode?.(value, { stream: true }) ?? '';
        const lines = chunk?.split?.('\n') ?? [];
        for (const line of lines) {
          if (line?.startsWith?.('data: ')) {
            const data = line?.slice?.(6) ?? '';
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed?.choices?.[0]?.delta?.content ?? '';
              if (delta) {
                assistantContent += delta;
                setMessages((prev: ChatMessage[]) => {
                  const updated = [...(prev ?? [])];
                  if ((updated?.length ?? 0) > 0) {
                    updated[updated.length - 1] = { role: 'assistant', content: assistantContent };
                  }
                  return updated;
                });
              }
            } catch {}
          }
        }
      }

      // Auto-speak the response if voice was used
      if (assistantContent && voiceSupported) {
        // Only auto-speak if the last user input was via voice
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      setMessages((prev: ChatMessage[]) => [
        ...(prev ?? []),
        { role: 'assistant', content: 'Disculpa, tuve un problema técnico. ¿Puedes intentar de nuevo? Si persiste, escríbenos por WhatsApp al +57 302 584 7979 🙏' },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, systemPrompt, nicho, sessionId, voiceSupported]);

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ delay: 0.5, type: 'spring' }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-wintech-dark hover:bg-blue-900 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
            aria-label="Abrir chat"
          >
            <MessageSquare className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-4 left-4 z-50 w-[calc(100vw-2rem)] sm:w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-wintech-dark p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-wintech-cyan/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-wintech-cyan" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">WinTech AI</p>
                  <p className="text-gray-400 text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                    En línea • Texto y Voz
                  </p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white p-1">
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
              {(messages ?? [])?.map((msg: ChatMessage, i: number) => (
                <div key={i} className={`flex gap-2 ${msg?.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg?.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-wintech-dark/10 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-3.5 h-3.5 text-wintech-dark" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${msg?.role === 'user'
                      ? 'bg-wintech-dark text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-800 rounded-bl-md'
                    }`}
                  >
                    {msg?.content ?? ''}
                  </div>
                  {msg?.role === 'assistant' && i > 0 && voiceSupported && (
                    <button
                      onClick={() => speakText(msg.content)}
                      className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center shrink-0 mt-1 transition-colors"
                      aria-label="Escuchar respuesta"
                      title="Escuchar respuesta"
                    >
                      <Volume2 className={`w-3 h-3 ${speaking ? 'text-wintech-orange' : 'text-gray-500'}`} />
                    </button>
                  )}
                  {msg?.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-wintech-orange/10 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-3.5 h-3.5 text-wintech-orange" />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-wintech-dark/10 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-wintech-dark" />
                  </div>
                  <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
                    <Loader2 className="w-4 h-4 animate-spin text-wintech-dark" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Voice indicator */}
            {listening && (
              <div className="px-4 py-2 bg-red-50 border-t border-red-100 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <p className="text-red-600 text-xs font-medium">Escuchando... Habla ahora</p>
                <button onClick={stopListening} className="ml-auto text-red-500 text-xs font-medium hover:text-red-700">Cancelar</button>
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t bg-white shrink-0">
              <div className="flex items-center gap-2">
                {voiceSupported && (
                  <button
                    onClick={listening ? stopListening : startListening}
                    disabled={loading}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                      listening
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-wintech-dark'
                    }`}
                    aria-label={listening ? 'Dejar de escuchar' : 'Hablar por voz'}
                    title={listening ? 'Dejar de escuchar' : 'Hablar por voz'}
                  >
                    {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                )}
                <input
                  ref={inputRef}
                  type="text"
                  value={input ?? ''}
                  onChange={(e: any) => setInput(e?.target?.value ?? '')}
                  onKeyDown={(e: any) => e?.key === 'Enter' && sendMessage()}
                  placeholder={listening ? 'Escuchando...' : 'Escribe o habla tu mensaje...'}
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-wintech-cyan focus:ring-1 focus:ring-wintech-cyan/30"
                  disabled={loading || listening}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !(input?.trim?.())}
                  className="w-9 h-9 rounded-xl bg-wintech-dark hover:bg-blue-900 disabled:opacity-50 text-white flex items-center justify-center transition-colors shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
