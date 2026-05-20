'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, User, Send, Loader2, ArrowRight, MessageCircle, Play, Sparkles,
  Phone, Mail, Building2, CalendarCheck, CheckCircle2, Star, ChevronDown,
  X, Clock, Shield, Zap, ArrowLeft, ExternalLink, Copy, Check
} from 'lucide-react';
import { WHATSAPP_URL } from '@/lib/constants';
import { getNichoChatPrompt } from '@/lib/chatbot-system-prompt';

interface ChatMsg {
  role: 'user' | 'assistant';
  content: string;
}

interface NichoData {
  id: string;
  title: string;
  description: string;
  image: string;
  chatPrompt: string;
}

const SUGGESTIONS_BY_NICHO: Record<string, string[]> = {
  'clinica-estetica': [
    '¿Qué tratamientos ofrecen?',
    '¿Cuánto cuesta una valoración?',
    '¿Tienen promociones este mes?',
    'Quiero agendar una cita',
  ],
  'dentistas': [
    '¿Qué servicios odontológicos tienen?',
    '¿Cuánto cuesta una valoración?',
    '¿Trabajan con ortodoncia invisible?',
    'Necesito agendar una cita',
  ],
  'abogados': [
    '¿En qué áreas se especializan?',
    '¿Cuánto cuesta la consulta inicial?',
    'Necesito asesoría laboral',
    'Quiero agendar una consulta',
  ],
  'talleres': [
    '¿Qué servicios de taller ofrecen?',
    '¿Cuánto cuesta una revisión?',
    '¿Tienen promoción de revisión gratis?',
    'Quiero agendar un servicio',
  ],
  'inmobiliarias': [
    '¿Qué propiedades tienen disponibles?',
    '¿Cuánto cuesta un apartamento?',
    '¿En qué zonas trabajan?',
    'Quiero agendar una visita',
  ],
};

const NICHO_ICONS: Record<string, string> = {
  'clinica-estetica': '✨',
  'dentistas': '🦷',
  'abogados': '⚖️',
  'talleres': '🔧',
  'inmobiliarias': '🏠',
};

export function DemoPageClient({ nicho, allNichos }: { nicho: NichoData; allNichos: NichoData[] }) {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: 'assistant', content: `¡Hola! 👋 Bienvenido/a. Soy el asistente virtual de este negocio. Estoy aquí para responder tus preguntas, darte información sobre nuestros servicios y ayudarte a agendar una cita.\n\n¿En qué te puedo colaborar?` },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', empresa: '', horario: '' });
  const [formSent, setFormSent] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const suggestions = SUGGESTIONS_BY_NICHO[nicho?.id ?? ''] ?? [];
  const nichoIcon = NICHO_ICONS[nicho?.id ?? ''] ?? '💬';

  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView?.({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = useCallback(async (textOverride?: string) => {
    const trimmed = (textOverride ?? input)?.trim?.() ?? '';
    if (!trimmed || loading) return;
    const userMsg: ChatMsg = { role: 'user', content: trimmed };
    setMessages((prev: ChatMsg[]) => [...(prev ?? []), userMsg]);
    setInput('');
    setLoading(true);
    setShowSuggestions(false);

    try {
      const sysPrompt = getNichoChatPrompt(nicho?.id ?? '');
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...(messages ?? []), userMsg]?.map((m: ChatMsg) => ({ role: m?.role, content: m?.content })),
          systemPrompt: sysPrompt,
          nicho: nicho?.id,
        }),
      });

      if (!response?.ok) throw new Error('Error');
      const reader = response?.body?.getReader();
      const decoder = new TextDecoder();
      let content = '';
      setMessages((prev: ChatMsg[]) => [...(prev ?? []), { role: 'assistant', content: '' }]);

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
                content += delta;
                setMessages((prev: ChatMsg[]) => {
                  const updated = [...(prev ?? [])];
                  if ((updated?.length ?? 0) > 0) {
                    updated[updated.length - 1] = { role: 'assistant', content };
                  }
                  return updated;
                });
              }
            } catch {}
          }
        }
      }
    } catch {
      setMessages((prev: ChatMsg[]) => [...(prev ?? []), { role: 'assistant', content: 'Disculpa, tuve un inconveniente técnico. ¿Puedes intentar de nuevo? Si persiste, escríbenos por WhatsApp al +57 302 584 7979 🙏' }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, nicho?.id]);

  const validateForm = (step: number): boolean => {
    const errors: Record<string, string> = {};
    if (step === 1) {
      if (!formData?.nombre?.trim()) errors.nombre = 'Tu nombre es obligatorio';
      if (!formData?.email?.trim()) errors.email = 'Tu email es obligatorio';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Email no válido';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitForm = async () => {
    if (!validateForm(1)) return;
    if (!formData?.nombre || !formData?.email) return;
    try {
      await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono || null,
          empresa: formData.empresa || null,
          nicho: nicho?.id,
          servicio: `Demo ${nicho?.title}`,
          fecha: new Date(Date.now() + 86400000).toISOString(),
          hora: formData.horario || '09:00',
          notas: 'Solicitud desde demo interactiva',
        }),
      });
      await fetch('/api/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, nicho: nicho?.id }),
      });
      setFormSent(true);
    } catch {
      setFormSent(true);
    }
  };

  const copyDemoLink = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <section className="relative py-12 sm:py-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image src={nicho?.image ?? ''} alt={nicho?.title ?? ''} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A2463]/95 via-[#0A2463]/85 to-[#0A2463]/75" />
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-wintech-cyan/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-wintech-orange/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link href="/" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Volver al inicio
            </Link>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-wintech-cyan text-sm font-medium mb-5 border border-white/10">
              <Sparkles className="w-4 h-4" /> Demo Interactivo
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
              IA para <span className="text-wintech-cyan">{nicho?.title ?? ''}</span>
            </h1>
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mb-3 leading-relaxed">
              Prueba en vivo cómo funcionaría un chatbot de IA entrenado para tu tipo de negocio. Haz preguntas, solicita información, intenta agendar una cita.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-wintech-cyan" /> Powered by WinTech AI</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-wintech-cyan" /> Palmira, Valle del Cauca</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Chat + CTA */}
      <section className="py-8 sm:py-12">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* Chat Window */}
          <div className="lg:col-span-2 order-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-[#0A2463] to-[#0d2d7a] p-4 flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-wintech-cyan/30 to-wintech-cyan/10 flex items-center justify-center border border-wintech-cyan/20">
                    <Bot className="w-5 h-5 text-wintech-cyan" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#0A2463]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">Asistente Virtual • {nicho?.title ?? ''}</p>
                  <p className="text-gray-400 text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
                    En línea • Responde al instante
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={copyDemoLink}
                    className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    title="Copiar enlace del demo"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div ref={chatContainerRef} className="h-[350px] sm:h-[420px] overflow-y-auto p-4 space-y-4 scrollbar-hide bg-gray-50/50">
                {(messages ?? [])?.map((msg: ChatMsg, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-2.5 ${msg?.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg?.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0A2463] to-[#0d2d7a] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <Bot className="w-4 h-4 text-wintech-cyan" />
                      </div>
                    )}
                    <div className={`max-w-[80%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg?.role === 'user'
                        ? 'bg-gradient-to-r from-[#0A2463] to-[#0d2d7a] text-white rounded-br-md shadow-sm'
                        : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100'
                    }`}>
                      {msg?.content ?? ''}
                    </div>
                    {msg?.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-wintech-orange/20 to-wintech-orange/10 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-4 h-4 text-wintech-orange" />
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-2.5"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0A2463] to-[#0d2d7a] flex items-center justify-center shrink-0 shadow-sm">
                      <Bot className="w-4 h-4 text-wintech-cyan" />
                    </div>
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Suggestions */}
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && messages.length <= 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="pt-2"
                    >
                      <p className="text-xs text-gray-400 mb-2 font-medium">Prueba preguntando:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.map((s, i) => (
                          <button
                            key={i}
                            onClick={() => sendMessage(s)}
                            className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs text-gray-600 hover:border-wintech-cyan/50 hover:text-wintech-dark hover:bg-wintech-cyan/5 transition-all shadow-sm"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-gray-100 bg-white">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input ?? ''}
                    onChange={(e: any) => setInput(e?.target?.value ?? '')}
                    onKeyDown={(e: any) => e?.key === 'Enter' && sendMessage()}
                    placeholder="Escribe una pregunta... (ej: ¿Qué servicios ofrecen?)"
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-wintech-cyan focus:ring-2 focus:ring-wintech-cyan/20 transition-all bg-gray-50/50"
                    disabled={loading}
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={loading || !(input?.trim?.())}
                    className="w-11 h-11 rounded-xl bg-gradient-to-r from-[#0A2463] to-[#0d2d7a] hover:shadow-lg disabled:opacity-40 disabled:hover:shadow-none text-white flex items-center justify-center transition-all shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 text-center">Demo generada con IA • Las respuestas son simuladas con fines demostrativos</p>
              </div>
            </div>
          </div>

          {/* CTA Sidebar */}
          <div className="space-y-5 order-2">
            {/* Main CTA Card */}
            <div className="bg-gradient-to-br from-[#0A2463] to-[#0d2d7a] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-wintech-cyan/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{nichoIcon}</span>
                  <h3 className="font-display font-bold text-lg">¿Quieres esto para tu negocio?</h3>
                </div>
                <p className="text-gray-300 text-sm mb-5 leading-relaxed">
                  Este chatbot fue entrenado en solo 2 minutos con información genérica. Imagina lo que hará cuando lo entrenemos específicamente para tu empresa.
                </p>

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                  <div className="text-center p-2 rounded-lg bg-white/5 border border-white/10">
                    <Clock className="w-4 h-4 text-wintech-cyan mx-auto mb-1" />
                    <p className="text-[10px] text-gray-400">24/7</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-white/5 border border-white/10">
                    <Shield className="w-4 h-4 text-wintech-cyan mx-auto mb-1" />
                    <p className="text-[10px] text-gray-400">Seguro</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-white/5 border border-white/10">
                    <Zap className="w-4 h-4 text-wintech-cyan mx-auto mb-1" />
                    <p className="text-[10px] text-gray-400">Instantáneo</p>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {!showForm && !formSent && (
                    <motion.div
                      key="cta-buttons"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-2.5"
                    >
                      <button
                        onClick={() => setShowForm(true)}
                        className="w-full py-3.5 rounded-xl bg-wintech-orange hover:bg-orange-600 font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                      >
                        <Play className="w-4 h-4" /> Quiero esto para mi negocio
                      </button>
                      <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 rounded-xl bg-white/10 border border-white/20 font-semibold text-sm transition-all flex items-center justify-center gap-2 hover:bg-white/20"
                      >
                        <MessageCircle className="w-4 h-4" /> Hablar por WhatsApp
                      </a>
                    </motion.div>
                  )}

                  {showForm && !formSent && (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-gray-400">Paso 1 de 1</p>
                        <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="text"
                            placeholder="Tu nombre *"
                            value={formData?.nombre ?? ''}
                            onChange={(e: any) => {
                              setFormData((p: any) => ({ ...(p ?? {}), nombre: e?.target?.value ?? '' }));
                              if (formErrors.nombre) setFormErrors((prev) => ({ ...prev, nombre: '' }));
                            }}
                            className={`w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/10 border text-white placeholder-gray-500 text-sm focus:outline-none focus:border-wintech-cyan transition-colors ${formErrors.nombre ? 'border-red-400' : 'border-white/20'}`}
                          />
                        </div>
                        {formErrors.nombre && <p className="text-red-400 text-xs mt-1 ml-1">{formErrors.nombre}</p>}
                      </div>

                      <div>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="email"
                            placeholder="Tu email *"
                            value={formData?.email ?? ''}
                            onChange={(e: any) => {
                              setFormData((p: any) => ({ ...(p ?? {}), email: e?.target?.value ?? '' }));
                              if (formErrors.email) setFormErrors((prev) => ({ ...prev, email: '' }));
                            }}
                            className={`w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/10 border text-white placeholder-gray-500 text-sm focus:outline-none focus:border-wintech-cyan transition-colors ${formErrors.email ? 'border-red-400' : 'border-white/20'}`}
                          />
                        </div>
                        {formErrors.email && <p className="text-red-400 text-xs mt-1 ml-1">{formErrors.email}</p>}
                      </div>

                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="tel"
                          placeholder="WhatsApp (opcional)"
                          value={formData?.telefono ?? ''}
                          onChange={(e: any) => setFormData((p: any) => ({ ...(p ?? {}), telefono: e?.target?.value ?? '' }))}
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-wintech-cyan transition-colors"
                        />
                      </div>

                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="text"
                          placeholder="Nombre de tu negocio"
                          value={formData?.empresa ?? ''}
                          onChange={(e: any) => setFormData((p: any) => ({ ...(p ?? {}), empresa: e?.target?.value ?? '' }))}
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-wintech-cyan transition-colors"
                        />
                      </div>

                      <button
                        onClick={submitForm}
                        disabled={!formData?.nombre || !formData?.email}
                        className="w-full py-3.5 rounded-xl bg-wintech-orange hover:bg-orange-600 disabled:opacity-40 font-semibold text-sm transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        <CalendarCheck className="w-4 h-4" /> Solicitar Demo Personalizado
                      </button>

                      <p className="text-[10px] text-gray-500 text-center">Sin compromiso • Respuesta en menos de 24 horas</p>
                    </motion.div>
                  )}

                  {formSent && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-6"
                    >
                      <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                        <CheckCircle2 className="w-7 h-7 text-green-400" />
                      </div>
                      <p className="font-bold text-lg mb-1">¡Solicitud enviada!</p>
                      <p className="text-sm text-gray-300 mb-4">Nuestro equipo te contactará pronto para personalizar tu demo.</p>
                      <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-wintech-cyan text-sm hover:underline"
                      >
                        <MessageCircle className="w-4 h-4" /> O escríbenos directo por WhatsApp
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Other Demos */}
            <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
              <h4 className="font-display font-bold text-sm text-wintech-dark mb-1">Explora otros demos</h4>
              <p className="text-xs text-gray-400 mb-4">Descubre cómo funciona la IA en diferentes industrias</p>
              <div className="space-y-1.5">
                {(allNichos ?? [])?.filter((n: any) => n?.id !== nicho?.id)?.map((n: any) => (
                  <Link
                    key={n?.id}
                    href={`/demo/${n?.id ?? ''}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-sm group transition-all border border-transparent hover:border-gray-100"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{NICHO_ICONS[n?.id] ?? '💼'}</span>
                      <div>
                        <span className="text-gray-700 font-medium">{n?.title ?? ''}</span>
                        <p className="text-[11px] text-gray-400 line-clamp-1">{n?.description ?? ''}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-wintech-cyan group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Social Proof Mini */}
            <div className="bg-gradient-to-br from-wintech-cyan/5 to-wintech-cyan/10 rounded-2xl p-5 border border-wintech-cyan/20">
              <div className="flex items-center gap-1 mb-2">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-wintech-orange text-wintech-orange" />)}
              </div>
              <p className="text-xs text-gray-600 italic leading-relaxed mb-2">
                "Desde que implementamos el chatbot, nuestras citas aumentaron un 45%. El sistema contesta las 24 horas."
              </p>
              <p className="text-[11px] text-gray-500 font-medium">— Dra. María Fernández, Clínica Estética</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function MapPin(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
