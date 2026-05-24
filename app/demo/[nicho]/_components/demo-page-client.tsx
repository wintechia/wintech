"use client";

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
    '¿Que tratamientos ofrecen?',
    '¿Cuanto cuesta una valoracion?',
    '¿Tienen promociones este mes?',
    'Quiero agendar una cita',
  ],
  'dentistas': [
    '¿Que servicios odontologicos tienen?',
    '¿Cuanto cuesta una valoracion?',
    '¿Trabajan con ortodoncia invisible?',
    'Necesito agendar una cita',
  ],
  'abogados': [
    '¿En que areas se especializan?',
    '¿Cuanto cuesta la consulta inicial?',
    'Necesito asesoria laboral',
    'Quiero agendar una consulta',
  ],
  'talleres': [
    '¿Que servicios de taller ofrecen?',
    '¿Cuanto cuesta una revision?',
    '¿Tienen promocion de revision gratis?',
    'Quiero agendar un servicio',
  ],
  'inmobiliarios': [
    '¿Que propiedades tienen disponibles?',
    '¿Cuanto cuesta un apartamento?',
    '¿En que zonas trabajan?',
    'Quiero agendar una visita',
  ],
};

const NICHO_ICONS: Record<string, string> = {
  'clinica-estetica': '✨',
  'dentistas': '🦷',
  'abogados': '⚖️',
  'talleres': '🔧',
  'inmobiliarios': '🏠',
};

export function DemoPageClient({ nicho, allNichos }: { nicho: NichoData; allNichos: NichoData[] }) {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: 'assistant', content: `¡Hola! 👉 Bienvenido/a. Soy el asistente virtual de este negocio. Estoy para responder tus preguntas, darte informacion sobre nuestros servicios y ayudarte a agendar una cita.\n\n¿En que te puedo colaborar?` },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSend = useCallback(async () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const prompt = getNichoChatPrompt(nicho.id);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          systemPrompt: prompt,
        }),
      });
      const data = await response.json();
      if (data.content) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, hubo un error. Intenta de nuevo.' }]);
    }
    setLoading(false);
  }, [input, loading, messages, nicho.id]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-wintech-dark text-white px-6 py-4 flex items-center gap-3">
              <Bot className="w-6 h-6 text-wintech-cyan" />
              <div>
                <h2 className="font-display font-bold">Demo en Vivo</h2>
                <p className="text-xs text-gray-400">{nicho.title}</p>
              </div>
            </div>
            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-wintech-dark text-white rounded-br-sm'
                      : 'bg-white shadow-sm rounded-bl-sm'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white shadow-sm rounded-2xl rounded-bl-sm px-4 py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-wintech-cyan" />
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t bg-white flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Escribe un mensaje..."
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-wintech-cyan/50 text-sm"
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className="px-4 py-2 bg-wintech-cyan text-white rounded-xl hover:bg-wintech-cyan/90 disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-display font-bold text-lg mb-4">Informacion</h3>
            <div className="space-y-4 text-sm text-gray-600">
              <p>{nicho.description}</p>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-wintech-cyan hover:underline">
                <MessageCircle className="w-4 h-4" /> Contactar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
