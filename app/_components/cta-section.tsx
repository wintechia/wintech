'use client';
import Link from 'next/link';
import { Rocket, MessageCircle } from 'lucide-react';
import { ScrollAnimation } from '@/components/scroll-animation';
import { WHATSAPP_URL } from '@/lib/constants';

export function CTASection() {
  return (
    <section className="py-20 bg-wintech-dark">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
        <ScrollAnimation>
          <Rocket className="w-12 h-12 text-wintech-cyan mx-auto mb-6" />
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            ¿Listo para que tu negocio trabaje <span className="text-wintech-cyan">mientras tú descansas?</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
            Agenda una consultoría gratuita de 15 minutos. Sin compromiso, sin letra pequeña.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-wintech-orange hover:bg-orange-600 text-white font-semibold text-base transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              <MessageCircle className="w-5 h-5" /> Hablar por WhatsApp
            </a>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-base hover:bg-white/20 transition-all"
            >
              Enviar Mensaje
            </Link>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
