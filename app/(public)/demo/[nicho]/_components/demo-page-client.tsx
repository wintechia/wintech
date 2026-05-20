'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bot, User, Send, Loader2, ArrowRight, MessageCircle, Play, Sparkles } from 'lucide-react';
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

export function DemoPageClient({ nicho, allNichos }: { nicho: NichoData; allNichos: NichoData[] }) {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: 'assistant', content: `¡Hola! 👋 Bienvenido/a. Soy el asistente virtual de este negocio. Estoy aquí para responder tus preguntas, darte información sobre nuestros servicios y ayudarte a agendar una cita. ¿En qué te puedo colaborar?` },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', empresa: '' });
  const [formSent, setFormSent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView?.({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    const trimmed = input?.trim?.() ?? '';
    if (!trimmed || loading) return;
    const userMsg: ChatMsg = { role: 'user', content: trimmed };
    setMessages((prev: ChatMsg[]) => [...(prev ?? []), userMsg]);
    setInput('');
    setLoading(true);

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
      setMessages((prev: ChatMsg[]) => [...(prev ?? []), { role: 'assistant', content: 'Disculpa, tuve un inconveniente técnico. ¿Puedes intentar de nuevo?' }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, nicho?.id]);

  const submitForm = async () => {
    if (!formData?.nombre || !formData?.email) return;
    try {
      // Guardar reserva en la base de datos
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
          fecha: new Date(Date.now() + 86400000).toISOString(), // Mañana
          hora: '09:00',
          notas: 'Solicitud desde demo interactiva',
        }),
      });
      // También enviar notificación por email
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

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image src={nicho?.image ?? ''} alt={nicho?.title ?? ''} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A2463]/95 to-[#0A2463]/80" />
        </div>
        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wintech-cyan/20 text-wintech-cyan text-sm mb-4">
              <Sparkles className="w-4 h-4" /> Demo Interactivo
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
              IA para <span className="text-wintech-cyan">{nicho?.title ?? ''}</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-xl mb-4">
              Prueba en vivo cómo funcionaría un chatbot de IA entrenado para tu tipo de negocio. Haz preguntas, solicita información, intenta agendar una cita.
            </p>
            <p className="text-gray-400 text-sm">Powered by WinTech AI • Palmira, Valle del Cauca</p>
          </motion.div>
        </div>
      </section>

      {/* Chat + CTA */}
      <section className="py-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Window */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-wintech-dark p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-wintech-cyan/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-wintech-cyan" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Asistente Virtual • {nicho?.title ?? ''}</p>
                  <p className="text-gray-400 text-xs">Demo en vivo • Responde al instante</p>
                </div>
              </div>

              <div className="h-[400px] overflow-y-auto p-4 space-y-3 scrollbar-hide">
                {(messages ?? [])?.map((msg: ChatMsg, i: number) => (
                  <div key={i} className={`flex gap-2 ${msg?.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg?.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-full bg-wintech-dark/10 flex items-center justify-center shrink-0 mt-1">
                        <Bot className="w-3.5 h-3.5 text-wintech-dark" />
                      </div>
                    )}
                    <div className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg?.role === 'user' ? 'bg-wintech-dark text-white rounded-br-md' : 'bg-gray-100 text-gray-800 rounded-bl-md'
                    }`}>
                      {msg?.content ?? ''}
                    </div>
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

              <div className="p-3 border-t">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input ?? ''}
                    onChange={(e: any) => setInput(e?.target?.value ?? '')}
                    onKeyDown={(e: any) => e?.key === 'Enter' && sendMessage()}
                    placeholder="Escribe una pregunta... (ej: ¿Qué servicios ofrecen?)"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-wintech-cyan"
                    disabled={loading}
                  />
                  <button onClick={sendMessage} disabled={loading || !(input?.trim?.())} className="w-10 h-10 rounded-xl bg-wintech-dark hover:bg-blue-900 disabled:opacity-50 text-white flex items-center justify-center transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Sidebar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-wintech-dark to-blue-900 rounded-2xl p-6 text-white">
              <h3 className="font-display font-bold text-lg mb-2">¿Quieres esto para tu negocio?</h3>
              <p className="text-gray-300 text-sm mb-4">Este chatbot fue entrenado en solo 2 minutos con información genérica. Imagina lo que hará cuando lo entrenemos específicamente para tu empresa.</p>
              
              {!showForm && !formSent && (
                <div className="space-y-3">
                  <button onClick={() => setShowForm(true)} className="w-full py-3 rounded-xl bg-wintech-orange hover:bg-orange-600 font-semibold text-sm transition-all flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" /> Quiero esto para mi negocio
                  </button>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="w-full py-3 rounded-xl bg-white/10 border border-white/20 font-semibold text-sm transition-all flex items-center justify-center gap-2 hover:bg-white/20">
                    <MessageCircle className="w-4 h-4" /> Hablar por WhatsApp
                  </a>
                </div>
              )}

              {showForm && !formSent && (
                <div className="space-y-3">
                  <input type="text" placeholder="Tu nombre" value={formData?.nombre ?? ''} onChange={(e: any) => setFormData((p: any) => ({ ...(p ?? {}), nombre: e?.target?.value ?? '' }))} className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-wintech-cyan" />
                  <input type="email" placeholder="Tu email" value={formData?.email ?? ''} onChange={(e: any) => setFormData((p: any) => ({ ...(p ?? {}), email: e?.target?.value ?? '' }))} className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-wintech-cyan" />
                  <input type="tel" placeholder="WhatsApp (opcional)" value={formData?.telefono ?? ''} onChange={(e: any) => setFormData((p: any) => ({ ...(p ?? {}), telefono: e?.target?.value ?? '' }))} className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-wintech-cyan" />
                  <input type="text" placeholder="Nombre de tu negocio" value={formData?.empresa ?? ''} onChange={(e: any) => setFormData((p: any) => ({ ...(p ?? {}), empresa: e?.target?.value ?? '' }))} className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-wintech-cyan" />
                  <button onClick={submitForm} disabled={!formData?.nombre || !formData?.email} className="w-full py-3 rounded-xl bg-wintech-orange hover:bg-orange-600 disabled:opacity-50 font-semibold text-sm transition-all">
                    Solicitar Demo Personalizado
                  </button>
                </div>
              )}

              {formSent && (
                <div className="text-center py-4">
                  <div className="text-3xl mb-2">🎉</div>
                  <p className="font-semibold">¡Listo!</p>
                  <p className="text-sm text-gray-300">Nuestro equipo te contactará pronto para personalizar tu demo.</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
              <h4 className="font-display font-bold text-sm text-wintech-dark mb-3">Prueba otros demos</h4>
              <div className="space-y-2">
                {(allNichos ?? [])?.filter((n: any) => n?.id !== nicho?.id)?.map((n: any) => (
                  <Link key={n?.id} href={`/demo/${n?.id ?? ''}`} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-sm group transition-colors">
                    <span className="text-gray-700">{n?.title ?? ''}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-wintech-cyan transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
