'use client';
import { Check, X, Crown } from 'lucide-react';
import { ScrollAnimation } from '@/components/scroll-animation';
import { PLANS, WHATSAPP_URL } from '@/lib/constants';

export function PricingSection() {
  return (
    <section id="planes" className="py-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <ScrollAnimation>
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-wintech-dark tracking-tight mb-4">
              Planes que se <span className="text-wintech-cyan">Pagan Solos</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Si el sistema genera 1 cliente nuevo al mes, la inversión se recupera sola. Setup hasta en 3 cuotas.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(PLANS ?? [])?.map((plan: any, i: number) => (
            <ScrollAnimation key={i} delay={i * 0.15}>
              <div className={`relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all h-full flex flex-col ${
                plan?.popular ? 'border-2 border-wintech-cyan ring-4 ring-wintech-cyan/10' : 'border border-gray-200'
              }`}>
                {plan?.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-wintech-cyan text-wintech-dark text-xs font-bold flex items-center gap-1">
                    <Crown className="w-3 h-3" /> MÁS POPULAR
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="font-display font-bold text-xl text-wintech-dark mb-1">Plan {plan?.name ?? ''}</h3>
                  <p className="text-sm text-gray-500 italic">&ldquo;{plan?.tagline ?? ''}&rdquo;</p>
                </div>

                <div className="mb-6">
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-0.5">Inversión inicial</p>
                    <p className="font-display text-2xl font-bold text-wintech-dark">COP ${plan?.setup ?? ''}</p>
                    <p className="text-xs text-gray-400">{plan?.setupUsd ?? ''}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-wintech-dark/5">
                    <p className="text-xs text-gray-500 mb-0.5">Mensualidad</p>
                    <p className="font-display text-xl font-bold text-wintech-orange">COP ${plan?.monthly ?? ''}<span className="text-sm font-normal text-gray-500">/mes</span></p>
                    <p className="text-xs text-gray-400">{plan?.monthlyUsd ?? ''}</p>
                  </div>
                </div>

                <div className="space-y-2.5 mb-6 flex-1">
                  {(plan?.features ?? [])?.map((f: any, j: number) => (
                    <div key={j} className="flex items-center gap-2 text-sm">
                      {f?.included ? (
                        <Check className="w-4 h-4 text-wintech-cyan shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-gray-300 shrink-0" />
                      )}
                      <span className={f?.included ? 'text-gray-700' : 'text-gray-400'}>{f?.name ?? ''}</span>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-500 mb-4">Ideal para: {plan?.ideal ?? ''}</p>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block text-center py-3 rounded-xl font-semibold transition-all ${
                    plan?.popular
                      ? 'bg-wintech-orange hover:bg-orange-600 text-white shadow-md'
                      : 'bg-wintech-dark hover:bg-blue-900 text-white'
                  }`}
                >
                  Empezar Ahora
                </a>
              </div>
            </ScrollAnimation>
          ))}
        </div>

        <ScrollAnimation delay={0.3}>
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              💳 Pagos por transferencia, Nequi, Daviplata o tarjeta • 🎁 10% de descuento al pagar anual • Setup hasta en 3 cuotas
            </p>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
