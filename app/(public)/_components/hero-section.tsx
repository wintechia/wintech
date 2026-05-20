'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Zap } from 'lucide-react';
import { WHATSAPP_URL } from '@/lib/constants';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://cdn.abacus.ai/images/bb9337f5-2c8f-448f-8a18-cc55936f8f8b.png"
          alt="Fondo tecnológico con redes neuronales"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A2463]/95 via-[#0A2463]/85 to-[#0A2463]/70" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 py-20">
        <div className="max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-6">
              <Zap className="w-4 h-4 text-wintech-cyan" />
              Agencia de IA en Palmira, Valle del Cauca
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-6"
          >
            Multiplica tus Ventas con{' '}
            <span className="text-wintech-cyan">IA que Trabaja 24/7</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed"
          >
            Convierte tu negocio en una máquina de generar clientes. Chatbots, recepcionista de voz y automatización que capturan leads mientras tú duermes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/demo/clinica-estetica"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-wintech-orange hover:bg-orange-600 text-white font-semibold text-base transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              <Play className="w-5 h-5" /> Ver Demo en Vivo
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold text-base hover:bg-white/20 transition-all"
            >
              Agendar Consultoría Gratuita <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 flex flex-wrap items-center gap-4 sm:gap-6 text-white/70 text-sm"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              +50 negocios activos
            </div>
            <div className="hidden sm:block">|</div>
            <div>Cobertura nacional</div>
            <div className="hidden sm:block">|</div>
            <div>Resultados en 30 días</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
