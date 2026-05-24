"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, X, Volume2, VolumeX, Loader2, Phone, PhoneOff } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function WinchoVoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [callStatus, setCallStatus] = useState<"idle" | "calling" | "connected" | "ended">("idle");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speakText = useCallback(async (text: string) => {
    if (!text || isMuted) return;
    
    setIsSpeaking(true);
    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => setIsSpeaking(false);
        audio.play();
      } else {
        // Fallback to browser TTS
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = "es-CO";
          utterance.rate = 0.95;
          utterance.pitch = 1.1;
          utterance.onend = () => setIsSpeaking(false);
          window.speechSynthesis.speak(utterance);
          synthRef.current = utterance;
        } else {
          setIsSpeaking(false);
        }
      }
    } catch {
      setIsSpeaking(false);
    }
  }, [isMuted]);

  const startListening = useCallback(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      return;
    }
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "es-CO";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        await handleSend(transcript);
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
        }),
      });
      const data = await response.json();

      if (data.content) {
        const assistantMsg: Message = { role: "assistant", content: data.content };
        setMessages((prev) => [...prev, assistantMsg]);
        await speakText(data.content);
      }
    } catch {
      const errorMsg = "Lo siento, hubo un error. ¿Puedes intentar de nuevo?";
      setMessages((prev) => [...prev, { role: "assistant", content: errorMsg }]);
    }
    setIsLoading(false);
  }, [inputText, messages, speakText]);

  const startCall = useCallback(async () => {
    setCallStatus("calling");
    setIsActive(true);
    
    const greeting = "¡Hola! Soy Wincho AI, el asistente de voz de WinTech AI. ¿En qué te puedo colaborar hoy?";
    setMessages([{ role: "assistant", content: greeting }]);
    await speakText(greeting);
    setCallStatus("connected");
  }, [speakText]);

  const endCall = useCallback(() => {
    setCallStatus("ended");
    setIsActive(false);
    setIsListening(false);
    setIsSpeaking(false);
    window.speechSynthesis?.cancel();
    audioRef.current?.pause();
    recognitionRef.current?.stop();
    setTimeout(() => {
      setCallStatus("idle");
      setMessages([]);
    }, 2000);
  }, []);

  return (
    <>
      {/* Floating Call Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full text-white shadow-2xl flex items-center justify-center hover:shadow-3xl transition-all"
            style={{ background: "linear-gradient(135deg, #3BCEAC, #0A2463)" }}
            aria-label="Llamar a Wincho AI"
          >
            <Phone className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Call Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-4 right-4 z-50 w-[380px] max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div
              className="px-5 py-4 text-white relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #0A2463 0%, #0D3B8C 50%, #3BCEAC 100%)" }}
            >
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-white/20 -translate-x-10 -translate-y-10" />
                <div className="absolute bottom-0 right-0 w-24 h-24 rounded-full bg-white/20 translate-x-5 translate-y-5" />
              </div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    <Volume2 className={`w-6 h-6 \${isSpeaking ? "animate-pulse" : ""}`} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg">Wincho AI</h3>
                    <p className="text-xs text-white/80">
                      {callStatus === "idle" && "Asistente de voz IA"}
                      {callStatus === "calling" && "Conectando..."}
                      {callStatus === "connected" && "En línea"}
                      {callStatus === "ended" && "Llamada finalizada"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => { endCall(); setIsOpen(false); }}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="h-72 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3BCEAC20, #0A246320)" }}>
                    <Phone className="w-8 h-8" style={{ color: "#0A2463" }} />
                  </div>
                  <p className="text-gray-500 text-sm mb-4">Haz clic en el micrófono para hablar con Wincho AI</p>
                </div>
              )}
              
              {messages.map((msg, i) => (
                <div key={i} className={`flex \${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed \${
                      msg.role === "user"
                        ? "text-white rounded-br-sm"
                        : "bg-white shadow-sm border border-gray-100 text-gray-800 rounded-bl-sm"
                    }`}
                    style={msg.role === "user" ? { background: "linear-gradient(135deg, #0A2463, #0D3B8C)" } : {}}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white shadow-sm border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-wintech-cyan rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-wintech-cyan rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-wintech-cyan rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Controls */}
            <div className="p-4 border-t bg-white">
              {callStatus === "idle" ? (
                <button
                  onClick={startCall}
                  className="w-full py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #3BCEAC, #0A2463)" }}
                >
                  <Phone className="w-5 h-5" />
                  Iniciar Llamada con Wincho AI
                </button>
              ) : (
                <>
                  {/* Text input */}
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Escribe un mensaje..."
                      className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-wintech-cyan/30 focus:border-wintech-cyan"
                    />
                    <button
                      onClick={() => handleSend()}
                      disabled={isLoading || !inputText.trim()}
                      className="p-2.5 rounded-xl text-white disabled:opacity-50 transition-all"
                      style={{ background: "#3BCEAC" }}
                    >
                      <Loader2 className={`w-5 h-5 \${isLoading ? "animate-spin" : ""}`} />
                    </button>
                  </div>

                  {/* Mic / End call */}
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={isListening ? stopListening : startListening}
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all \${
                        isListening
                          ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                    </button>
                    <button
                      onClick={endCall}
                      className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all shadow-lg shadow-red-500/30"
                    >
                      <PhoneOff className="w-6 h-6" />
                    </button>
                  </div>
                  
                  {isListening && (
                    <p className="text-xs text-center text-red-500 mt-2 animate-pulse">🎙️ Escuchando... habla ahora</p>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
