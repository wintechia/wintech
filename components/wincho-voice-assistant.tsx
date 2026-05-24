"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Mic, MicOff, X, Volume2, Loader2, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function WinchoVoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "¡Hola! Soy Wincho AI, el asistente de voz de WinTech. ¿En qué te puedo colaborar hoy?",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Speech-to-Text (Web Speech API)
  const startListening = useCallback(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Tu navegador no soporta reconocimiento de voz. Escribe tu mensaje.");
      return;
    }
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "es-CO";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join("");
      if (event.results[0].isFinal) {
        setInputText(transcript);
        handleSend(transcript);
      }
    };
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  // Send message to API
  const handleSend = useCallback(async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText || isLoading) return;

    const userMsg: Message = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          systemPrompt:
            "Eres Wincho AI, el asistente de voz de WinTech AI. Eres profesional, cercano y colombiano. Explica los servicios de WinTech: chatbots, recepcionista de voz IA, automatización de marketing, SEO local. Nichos: clínicas estéticas, dentistas, abogados, talleres mecánicos, inmobiliarias. Siempre ofrece agendar una demostración. Usa respuestas cortas y directas.",
        }),
      });
      const data = await response.json();

      if (data.content) {
        const assistantMsg: Message = { role: "assistant", content: data.content };
        setMessages((prev) => [...prev, assistantMsg]);

        // Text-to-Speech
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(data.content);
          utterance.lang = "es-CO";
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
          utterance.onstart = () => setIsSpeaking(true);
          utterance.onend = () => setIsSpeaking(false);
          window.speechSynthesis.speak(utterance);
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Lo siento, hubo un error. ¿Puedes intentar de nuevo?" },
      ]);
    }
    setIsLoading(false);
  }, [inputText, messages]);

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-wintech-cyan to-wintech-dark text-white shadow-lg flex items-center justify-center hover:shadow-xl transition-all"
            style={{ background: "linear-gradient(135deg, #3BCEAC, #0A2463)" }}
            aria-label="Abrir asistente de voz"
          >
            <Volume2 className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-4 right-4 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div
              className="px-4 py-3 flex items-center justify-between text-white"
              style={{ background: "linear-gradient(135deg, #0A2463, #0D3B8C)" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm">Wincho AI</h3>
                  <p className="text-xs text-white/70">Asistente de voz</p>
                </div>
              </div>
              <button onClick={() => { setIsOpen(false); window.speechSynthesis?.cancel(); }} className="p-1 hover:bg-white/10 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex \${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm \${
                      msg.role === "user"
                        ? "bg-wintech-dark text-white rounded-br-sm"
                        : "bg-white shadow-sm rounded-bl-sm text-gray-800"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white shadow-sm rounded-2xl rounded-bl-sm px-3 py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-wintech-cyan" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Escribe o habla..."
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-wintech-cyan/50"
                />
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`p-2 rounded-xl transition-colors \${
                    isListening
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading || !inputText.trim()}
                  className="p-2 rounded-xl bg-wintech-cyan text-white disabled:opacity-50"
                  style={{ background: "#3BCEAC" }}
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
              {isListening && (
                <p className="text-xs text-center text-red-500 mt-1 animate-pulse">🎙️ Escuchando...</p>
              )}
              {isSpeaking && (
                <p className="text-xs text-center text-wintech-cyan mt-1">🔊 Hablando...</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
