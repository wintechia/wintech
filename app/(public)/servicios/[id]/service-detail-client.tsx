'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Check, TrendingUp, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { WHATSAPP_URL } from '@/lib/constants';

interface ServiceProps {
  service: {
    id: string;
    title: string;
    description: string;
    image: string;
    benefits: string[];
    roi: string;
    precio: string;
  };
}

export function ServiceDetailClient({ service }: ServiceProps) {
  return (
    <div className="py-8">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <Link href="/#servicios" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-wintech-dark mb-8">
          <ArrowLeft className="w-4 h-4" /> Volver a servicios
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
              <Image src={service?.image ?? ''} alt={service?.title ?? ''} fill className="object-cover" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-wintech-dark tracking-tight mb-4">
              {service?.title ?? ''}
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">{service?.description ?? ''}</p>

            <div className="bg-wintech-dark/5 rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-wintech-orange" />
                <h3 className="font-display font-bold text-wintech-dark">ROI Esperado</h3>
              </div>
              <p className="text-gray-700 text-sm">{service?.roi ?? ''}</p>
            </div>

            <div className="mb-6">
              <h3 className="font-display font-bold text-lg text-wintech-dark mb-3">Beneficios Clave</h3>
              <div className="space-y-2">
                {(service?.benefits ?? [])?.map((b: string, i: number) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-wintech-cyan shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{b ?? ''}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
              <p className="text-sm text-gray-500 mb-1">Precio</p>
              <p className="font-display text-xl font-bold text-wintech-orange">{service?.precio ?? ''}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/demo/clinica-estetica`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-wintech-dark hover:bg-blue-900 text-white font-semibold transition-all"
              >
                Ver Demo en Vivo
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-wintech-orange hover:bg-orange-600 text-white font-semibold transition-all"
              >
                <MessageCircle className="w-5 h-5" /> Agendar Demo
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
