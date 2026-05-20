import Link from 'next/link';
import { Zap, Mail, Phone, MapPin } from 'lucide-react';
import { EMAIL, WHATSAPP_NUMBER } from '@/lib/constants';

export function SiteFooter() {
  return (
    <footer className="bg-wintech-dark text-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-wintech-cyan/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-wintech-cyan" />
              </div>
              <span className="font-display font-bold text-lg">Win<span className="text-wintech-cyan">Tech</span> AI</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Hacemos que tu negocio consiga más clientes con inteligencia artificial. Chatbots, voz IA y automatización que trabajan 24/7 por ti.
            </p>
          </div>
          <div>
            <h3 className="font-display font-semibold mb-4">Navegación</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-sm text-gray-400 hover:text-wintech-cyan transition-colors">Inicio</Link>
              <Link href="/nosotros" className="block text-sm text-gray-400 hover:text-wintech-cyan transition-colors">Nosotros</Link>
              <Link href="/blog" className="block text-sm text-gray-400 hover:text-wintech-cyan transition-colors">Blog</Link>
              <Link href="/contacto" className="block text-sm text-gray-400 hover:text-wintech-cyan transition-colors">Contacto</Link>
            </div>
          </div>
          <div>
            <h3 className="font-display font-semibold mb-4">Contacto</h3>
            <div className="space-y-3">
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 text-sm text-gray-400 hover:text-wintech-cyan transition-colors">
                <Mail className="w-4 h-4" /> {EMAIL}
              </a>
              <a href="https://wa.me/573025847979" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-400 hover:text-wintech-cyan transition-colors">
                <Phone className="w-4 h-4" /> {WHATSAPP_NUMBER}
              </a>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4 shrink-0" /> Palmira, Valle del Cauca, Colombia
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 text-center text-sm text-gray-500">
          © 2026 WinTech AI. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
