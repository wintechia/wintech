'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, Zap, Bot, Sparkles } from 'lucide-react';
import { useRef } from 'react';
import { WHATSAPP_URL } from '@/lib/constants';

function ParticleField() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 4,
    delay: Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-wintech-cyan/30"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

function FloatingBadge({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="absolute z-[3] hidden lg:block"
    >
      {children}
    </motion.div>
  );
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={sectionRef} className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* Background with parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
        <Image
          src="https://cdn.abacus.ai/images/bb9337f5-2c8f-448f-8a18-cc55936f8f8b.png"
          alt="Fondo tecnológico con redes neuronales"
          fill
          className="object-cover scale-110"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A2463]/97 via-[#0A2463]/88 to-[#0A2463]/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A2463]/60 via-transparent to-transparent" />
      </motion.div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 z-[1] grid-pattern opacity-40" />

      {/* Particle field */}
      <ParticleField />

      {/* Floating decorative badges */}
      <FloatingBadge delay={0.8}>
        <div className="glass rounded-xl px-4 py-2.5 flex items-center gap-2 top-[15%] right-[8%]">
          <Bot className="w-5 h-5 text-wintech-cyan" />
          <span className="text-white text-sm font-medium">IA 24/7</span>
        </div>
      </FloatingBadge>
      <FloatingBadge delay={1.2}>
        <div className="glass rounded-xl px-4 py-2.5 flex items-center gap-2 top-[55%] right-[5%]">
          <Sparkles className="w-5 h-5 text-wintech-orange" />
          <span className="text-white text-sm font-medium">+50 negocios</span>
        </div>
      </FloatingBadge>

      {/* Main content */}
      <motion.div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 py-24 w-full" style={{ opacity: contentOpacity }}>
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-white/90 text-sm mb-8 group cursor-default">
              <Zap className="w-4 h-4 text-wintech-cyan group-hover:animate-pulse" />
              <span>Agencia de IA en Palmira, Valle del Cauca</span>
              <span className="w-1.5 h-1.5 rounded-full bg-wintech-cyan animate-pulse" />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6"
          >
            Multiplica tus Ventas con{' '}
            <span className="relative inline-block">
              <span className="text-gradient-cyan">IA que Trabaja 24/7</span>
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-wintech-cyan to-transparent rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
                style={{ transformOrigin: 'left' }}
              />
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg sm:text-xl text-gray-300 mb-10 leading-relaxed max-w-xl"
          >
            Convierte tu negocio en una máquina de generar clientes. Chatbots, recepcionista de voz y automatización que capturan leads mientras tú duermes.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/demo/clinica-estetica"
              className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-wintech-orange hover:bg-orange-600 text-white font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-glow-orange hover:scale-[1.03] active:scale-[0.98] overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <Play className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Ver Demo en Vivo</span>
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl glass text-white font-semibold text-base hover:bg-white/15 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            >
              <span>Agendar Consultoría Gratuita</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-12 flex flex-wrap items-center gap-4 sm:gap-6"
          >
            <div className="flex items-center gap-2.5 text-white/70 text-sm">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-400 animate-ping opacity-75" />
              </div>
              <span>+50 negocios activos</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <div className="text-white/70 text-sm">Cobertura nacional</div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <div className="text-white/70 text-sm">Resultados en 30 días</div>
          </motion.div>

          {/* Trust logos / metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="mt-10 flex flex-wrap gap-8"
          >
            {[
              { value: '62%', label: 'Llamadas perdidas recuperadas' },
              { value: '45%', label: 'Aumento en citas agendadas' },
              { value: '3x', label: 'Más leads capturados' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="font-display text-2xl font-bold text-wintech-cyan">{stat.value}</span>
                <span className="text-white/50 text-xs leading-tight max-w-[100px]">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-white/40 text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-2 rounded-full bg-wintech-cyan"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
