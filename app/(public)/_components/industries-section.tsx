'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Smile, Scale, Wrench, Home, ArrowRight } from 'lucide-react';
import { ScrollAnimation } from '@/components/scroll-animation';
import { NICHOS } from '@/lib/constants';

const ICONS: Record<string, any> = { Sparkles, Smile, Scale, Wrench, Home };

export function IndustriesSection() {
  return (
    <section className="py-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <ScrollAnimation>
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-wintech-dark tracking-tight mb-4">
              Industrias que <span className="text-wintech-cyan">Transformamos</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Nos especializamos en nichos donde la IA genera el mayor impacto. Prueba nuestro demo interactivo.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {(NICHOS ?? [])?.map((nicho: any, i: number) => {
            const Icon = ICONS[nicho?.icon ?? ''];
            return (
              <ScrollAnimation key={nicho?.id ?? i} delay={i * 0.1}>
                <Link href={`/demo/${nicho?.id ?? ''}`} className="group block">
                  <div className="relative rounded-2xl overflow-hidden aspect-[3/4] shadow-md hover:shadow-xl transition-all duration-300">
                    <Image src={nicho?.image ?? ''} alt={nicho?.title ?? ''} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A2463]/90 via-[#0A2463]/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center mb-3">
                        {Icon && <Icon className="w-5 h-5 text-wintech-cyan" />}
                      </div>
                      <h3 className="font-display font-bold text-white text-base mb-1">{nicho?.title ?? ''}</h3>
                      <p className="text-gray-300 text-xs leading-relaxed line-clamp-2">{nicho?.description ?? ''}</p>
                      <div className="mt-2 flex items-center gap-1 text-wintech-cyan text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        Probar Demo <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollAnimation>
            );
          })}
        </div>
      </div>
    </section>
  );
}
