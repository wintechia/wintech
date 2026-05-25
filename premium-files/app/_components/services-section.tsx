'use client';
import Link from 'next/link';
import Image from 'next/image';
import { MessageSquareText, Phone, DatabaseZap, Star, Search, ArrowRight } from 'lucide-react';
import { ScrollAnimation } from '@/components/scroll-animation';
import { SERVICES } from '@/lib/constants';

const ICONS: Record<string, any> = { MessageSquareText, Phone, DatabaseZap, Star, Search };

export function ServicesSection() {
  return (
    <section id="servicios" className="py-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <ScrollAnimation>
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-wintech-dark tracking-tight mb-4">
              5 Servicios de IA que <span className="text-wintech-cyan">Trabajan por Ti</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Un ecosistema completo de inteligencia artificial que captura, califica y convierte clientes automáticamente.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(SERVICES ?? [])?.map((service: any, i: number) => {
            const Icon = ICONS[service?.icon ?? ''];
            return (
              <ScrollAnimation key={service?.id ?? i} delay={i * 0.1}>
                <Link href={`/servicios/${service?.id ?? ''}`} className="group block h-full">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-wintech-cyan/30 h-full flex flex-col">
                    <div className="relative aspect-[4/3] bg-gray-100">
                      <Image src={service?.image ?? ''} alt={service?.title ?? 'Servicio'} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <div className="w-10 h-10 rounded-lg bg-wintech-dark/80 backdrop-blur flex items-center justify-center">
                          {Icon && <Icon className="w-5 h-5 text-wintech-cyan" />}
                        </div>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-display font-bold text-lg text-wintech-dark mb-2 group-hover:text-wintech-cyan transition-colors">{service?.title ?? ''}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-3 flex-1">{service?.shortDesc ?? ''}</p>
                      <div className="flex items-center gap-1 text-wintech-orange font-semibold text-sm">
                        Ver más <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
