'use client';
import { Shield, Brain, Target, Settings, ArrowDown } from 'lucide-react';
import { ScrollAnimation } from '@/components/scroll-animation';

const LAYERS = [
  { icon: Shield, number: '01', title: 'Fachada de Credibilidad', desc: 'Página profesional, propuesta clara, CTAs visibles, reseñas en vivo. Convierte en 3 segundos.', color: 'bg-blue-50 text-blue-600' },
  { icon: Brain, number: '02', title: 'Cerebro de IA Conversacional', desc: 'Chatbot + recepcionista de voz IA. Contesta y agenda sin que levantes el teléfono.', color: 'bg-cyan-50 text-wintech-cyan' },
  { icon: Target, number: '03', title: 'Redes Invisibles de Captura', desc: 'Formularios inteligentes, calendarios, pop-ups de salida. Ningún visitante se va sin ser capturado.', color: 'bg-orange-50 text-wintech-orange' },
  { icon: Settings, number: '04', title: 'Backend de Automatización', desc: 'CRM conectado: SMS y email en menos de 60 segundos. Recordatorios y reseñas automáticas.', color: 'bg-purple-50 text-purple-600' },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <ScrollAnimation>
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-wintech-dark tracking-tight mb-4">
              El Sistema de <span className="text-wintech-cyan">4 Capas</span> que Vende por Ti
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">No te damos solo una página bonita. Te entregamos un sistema completo que captura y convierte clientes las 24 horas.</p>
          </div>
        </ScrollAnimation>
        <div className="max-w-3xl mx-auto space-y-4">
          {(LAYERS ?? [])?.map((layer: any, i: number) => {
            const Icon = layer?.icon;
            return (
              <div key={i}>
                <ScrollAnimation delay={i * 0.15}>
                  <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow flex items-start gap-5">
                    <div className={`w-14 h-14 rounded-xl ${layer?.color ?? 'bg-gray-50'} flex items-center justify-center shrink-0`}>
                      {Icon && <Icon className="w-7 h-7" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono text-xs text-gray-400 font-bold">{layer?.number ?? ''}</span>
                        <h3 className="font-display font-bold text-lg text-wintech-dark">{layer?.title ?? ''}</h3>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{layer?.desc ?? ''}</p>
                    </div>
                  </div>
                </ScrollAnimation>
                {i < (LAYERS?.length ?? 0) - 1 && (
                  <div className="flex justify-center py-1">
                    <ArrowDown className="w-5 h-5 text-gray-300" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
