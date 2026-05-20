'use client';
import { motion } from 'framer-motion';
import { ScrollAnimation } from '@/components/scroll-animation';
import { Zap, Target, TrendingUp, Users, MapPin, Lightbulb, Repeat } from 'lucide-react';

const VALUES = [
  { icon: Lightbulb, title: 'Innovación Constante', desc: 'Usamos lo último en inteligencia artificial para que tu negocio siempre esté un paso adelante de la competencia.' },
  { icon: Repeat, title: 'Acompañamiento Continuo', desc: 'No te dejamos solo. Nuestro equipo optimiza y mejora tus resultados mes a mes para que sigas creciendo.' },
  { icon: TrendingUp, title: 'Resultados Medibles', desc: 'Sabemos exactamente cuántos clientes nuevos te genera cada servicio. Si no ves resultados, nosotros tampoco ganamos.' },
  { icon: Users, title: 'Cercanía y Confianza', desc: 'Somos del Valle del Cauca y hablamos tu idioma. Te explicamos todo clarito, sin tecnicismos ni enredos.' },
];

const TEAM = [
  { name: 'Director de Tecnología', role: 'Arquitecto de soluciones IA', initials: 'DT' },
  { name: 'Directora Comercial', role: 'Estrategia y crecimiento', initials: 'DC' },
  { name: 'Ingeniero de IA', role: 'Desarrollo de chatbots y automatización', initials: 'IA' },
];

export function NosotrosClient() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 bg-wintech-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #3BCEAC 0%, transparent 50%)' }} />
        </div>
        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wintech-cyan/20 text-wintech-cyan text-sm mb-4">
              <Zap className="w-4 h-4" /> Sobre Nosotros
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
              Tu Negocio Merece un <span className="text-wintech-cyan">Equipo que Nunca Descansa</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl">
              En WinTech AI ayudamos a negocios como el tuyo a captar más clientes, cerrar más ventas y crecer todos los meses con inteligencia artificial. Sin complicaciones.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <ScrollAnimation>
              <div>
                <h2 className="font-display text-2xl font-bold text-wintech-dark mb-4">Nuestra Misión</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Que cada negocio local en Colombia tenga acceso a la misma tecnología de inteligencia artificial que usan las grandes empresas. Sin importar tu tamaño, mereces un sistema que atraiga y atienda clientes las 24 horas del día.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Nos encargamos de todo lo técnico para que tú te enfoques en lo que mejor sabes hacer: <strong>atender a tus clientes y hacer crecer tu negocio</strong>.
                </p>
              </div>
            </ScrollAnimation>
            <ScrollAnimation delay={0.2}>
              <div>
                <h2 className="font-display text-2xl font-bold text-wintech-dark mb-4">¿Por qué somos diferentes?</h2>
                <div className="bg-wintech-dark/5 rounded-2xl p-6">
                  <p className="text-gray-700 leading-relaxed mb-3">
                    <strong>No te vendemos un proyecto y desaparecemos.</strong> Nos quedamos contigo, optimizando tu sistema mes a mes, asegurándonos de que cada vez consigas más clientes.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Piénsalo así:</strong> Tienes un empleado digital que trabaja 24/7, no pide vacaciones, no se enferma y cada mes lo mejoramos para que rinda aún más. Esa es la diferencia WinTech.
                  </p>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <ScrollAnimation>
            <h2 className="font-display text-3xl font-bold text-wintech-dark text-center mb-10 tracking-tight">Nuestros Valores</h2>
          </ScrollAnimation>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(VALUES ?? [])?.map((v: any, i: number) => {
              const Icon = v?.icon;
              return (
                <ScrollAnimation key={i} delay={i * 0.1}>
                  <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow h-full">
                    <div className="w-12 h-12 rounded-xl bg-wintech-cyan/10 flex items-center justify-center mb-4">
                      {Icon && <Icon className="w-6 h-6 text-wintech-cyan" />}
                    </div>
                    <h3 className="font-display font-bold text-wintech-dark mb-2">{v?.title ?? ''}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{v?.desc ?? ''}</p>
                  </div>
                </ScrollAnimation>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <ScrollAnimation>
            <h2 className="font-display text-3xl font-bold text-wintech-dark text-center mb-10 tracking-tight">Nuestro Equipo</h2>
          </ScrollAnimation>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {(TEAM ?? [])?.map((member: any, i: number) => (
              <ScrollAnimation key={i} delay={i * 0.15}>
                <div className="bg-white rounded-2xl p-6 shadow-md text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-wintech-dark to-blue-800 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">{member?.initials ?? ''}</span>
                  </div>
                  <h3 className="font-display font-bold text-wintech-dark">{member?.name ?? ''}</h3>
                  <p className="text-gray-500 text-sm">{member?.role ?? ''}</p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <ScrollAnimation>
            <div className="flex items-center gap-2 justify-center mb-6">
              <MapPin className="w-5 h-5 text-wintech-orange" />
              <h2 className="font-display text-2xl font-bold text-wintech-dark">Nuestra Ubicación</h2>
            </div>
            <p className="text-center text-gray-600 mb-8">Palmira, Valle del Cauca, Colombia • Cobertura nacional</p>
          </ScrollAnimation>
          <ScrollAnimation>
            <div className="rounded-2xl overflow-hidden shadow-lg h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3981!2d-76.310625!3d3.539375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2sco"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación WinTech AI en Palmira"
              />
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  );
}
