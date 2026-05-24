'use client';
import Image from 'next/image';
import { Star, Quote } from 'lucide-react';
import { ScrollAnimation } from '@/components/scroll-animation';
import { TESTIMONIALS } from '@/lib/constants';

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <ScrollAnimation>
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-wintech-dark tracking-tight mb-4">
              Lo que Dicen <span className="text-wintech-cyan">Nuestros Clientes</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Resultados reales de negocios que ya multiplicaron sus ventas con WinTech AI.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(TESTIMONIALS ?? [])?.map((t: any, i: number) => (
            <ScrollAnimation key={i} delay={i * 0.15}>
              <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
                <Quote className="w-8 h-8 text-wintech-cyan/30 mb-4" />
                <p className="text-gray-700 text-sm leading-relaxed flex-1 mb-4">&ldquo;{t?.content ?? ''}&rdquo;</p>
                <div className="flex mb-3">
                  {Array.from({ length: t?.rating ?? 5 })?.map((_: any, j: number) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                    <Image src={t?.image ?? ''} alt={t?.name ?? 'Cliente'} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-wintech-dark">{t?.name ?? ''}</p>
                    <p className="text-xs text-gray-500">{t?.role ?? ''}</p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
