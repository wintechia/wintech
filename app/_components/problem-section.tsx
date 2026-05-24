'use client';
import { AlertTriangle, PhoneOff, Clock, TrendingDown } from 'lucide-react';
import { ScrollAnimation } from '@/components/scroll-animation';
import { AnimatedCounter } from '@/components/animated-counter';

const STATS = [
  { icon: PhoneOff, value: 62, suffix: '%', label: 'de llamadas a negocios locales NUNCA son contestadas', color: 'text-red-500', bg: 'bg-red-50' },
  { icon: Clock, value: 5, suffix: ' min', label: 'es lo máximo que un lead espera antes de irse con la competencia', color: 'text-wintech-orange', bg: 'bg-orange-50' },
  { icon: TrendingDown, value: 78, suffix: '%', label: 'de los clientes compran al PRIMERO que contesta', color: 'text-wintech-cyan', bg: 'bg-cyan-50' },
];

export function ProblemSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <ScrollAnimation>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium mb-4">
              <AlertTriangle className="w-4 h-4" /> El Problema
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-wintech-dark tracking-tight mb-4">
              Cada minuto sin contestar es <span className="text-red-500">dinero que se pierde</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Mientras duermes, almuerzas o atiendes a otro cliente, tus leads se van con la competencia.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(STATS ?? [])?.map((stat: any, i: number) => {
            const Icon = stat?.icon;
            return (
              <ScrollAnimation key={i} delay={i * 0.15}>
                <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow text-center">
                  <div className={`w-14 h-14 rounded-xl ${stat?.bg ?? 'bg-gray-50'} flex items-center justify-center mx-auto mb-4`}>
                    {Icon && <Icon className={`w-7 h-7 ${stat?.color ?? ''}`} />}
                  </div>
                  <div className="font-display text-4xl font-bold text-wintech-dark mb-2">
                    <AnimatedCounter end={stat?.value ?? 0} suffix={stat?.suffix ?? ''} />
                  </div>
                  <p className="text-gray-600 text-sm">{stat?.label ?? ''}</p>
                </div>
              </ScrollAnimation>
            );
          })}
        </div>
      </div>
    </section>
  );
}
