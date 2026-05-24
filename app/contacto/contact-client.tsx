'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ScrollAnimation } from '@/components/scroll-animation';
import { Mail, Phone, MapPin, Send, MessageCircle, CheckCircle, Loader2 } from 'lucide-react';
import { WHATSAPP_URL, EMAIL, WHATSAPP_NUMBER } from '@/lib/constants';

export function ContactClient() {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', empresa: '', nicho: '', planInteres: '', mensaje: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.();
    if (!form?.nombre || !form?.email || !form?.mensaje) { setError('Por favor completa los campos requeridos'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res?.ok) {
        setSent(true);
      } else {
        setError('Error al enviar. Intenta de nuevo o escríbenos por WhatsApp.');
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="py-16 bg-wintech-dark">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl font-bold text-white tracking-tight mb-3">
              Hablemos sobre <span className="text-wintech-cyan">tu Negocio</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-xl">
              Cuéntanos qué necesitas y te mostramos cómo la IA puede multiplicar tus resultados.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Form */}
            <div className="lg:col-span-2">
              <ScrollAnimation>
                {sent ? (
                  <div className="bg-green-50 rounded-2xl p-8 text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="font-display font-bold text-xl text-wintech-dark mb-2">¡Mensaje Enviado!</h3>
                    <p className="text-gray-600">Con mucho gusto te contactaremos pronto. Quedo atento por si necesitas algo más.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                        <input type="text" required value={form?.nombre ?? ''} onChange={(e: any) => setForm((p: any) => ({ ...(p ?? {}), nombre: e?.target?.value ?? '' }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-wintech-cyan focus:ring-1 focus:ring-wintech-cyan/30" placeholder="Tu nombre completo" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input type="email" required value={form?.email ?? ''} onChange={(e: any) => setForm((p: any) => ({ ...(p ?? {}), email: e?.target?.value ?? '' }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-wintech-cyan focus:ring-1 focus:ring-wintech-cyan/30" placeholder="tu@email.com" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono / WhatsApp</label>
                        <input type="tel" value={form?.telefono ?? ''} onChange={(e: any) => setForm((p: any) => ({ ...(p ?? {}), telefono: e?.target?.value ?? '' }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-wintech-cyan focus:ring-1 focus:ring-wintech-cyan/30" placeholder="+57 300 000 0000" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Negocio</label>
                        <input type="text" value={form?.empresa ?? ''} onChange={(e: any) => setForm((p: any) => ({ ...(p ?? {}), empresa: e?.target?.value ?? '' }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-wintech-cyan focus:ring-1 focus:ring-wintech-cyan/30" placeholder="Tu empresa" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Negocio</label>
                        <select value={form?.nicho ?? ''} onChange={(e: any) => setForm((p: any) => ({ ...(p ?? {}), nicho: e?.target?.value ?? '' }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-wintech-cyan bg-white">
                          <option value="">Selecciona...</option>
                          <option value="clinica-estetica">Clínica Estética</option>
                          <option value="dentista">Dentista / Odontólogo</option>
                          <option value="abogado">Abogado / Bufete</option>
                          <option value="taller">Taller Mecánico</option>
                          <option value="inmobiliaria">Inmobiliaria</option>
                          <option value="otro">Otro</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Plan de Interés</label>
                        <select value={form?.planInteres ?? ''} onChange={(e: any) => setForm((p: any) => ({ ...(p ?? {}), planInteres: e?.target?.value ?? '' }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-wintech-cyan bg-white">
                          <option value="">Selecciona...</option>
                          <option value="impulso">Plan Impulso ($280.000/mes)</option>
                          <option value="crecimiento">Plan Crecimiento ($580.000/mes)</option>
                          <option value="dominio-total">Plan Dominio Total ($1.150.000/mes)</option>
                          <option value="no-seguro">No estoy seguro aún</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje *</label>
                      <textarea required rows={4} value={form?.mensaje ?? ''} onChange={(e: any) => setForm((p: any) => ({ ...(p ?? {}), mensaje: e?.target?.value ?? '' }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-wintech-cyan focus:ring-1 focus:ring-wintech-cyan/30 resize-none" placeholder="Cuéntanos sobre tu negocio y qué necesitas..." />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-wintech-orange hover:bg-orange-600 disabled:opacity-50 text-white font-semibold transition-all">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                      {loading ? 'Enviando...' : 'Enviar Mensaje'}
                    </button>
                    <p className="text-xs text-gray-400">Tu información está segura y solo será utilizada para contactarte.</p>
                  </form>
                )}
              </ScrollAnimation>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <ScrollAnimation delay={0.2}>
                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                  <h3 className="font-display font-bold text-wintech-dark mb-4">Información de Contacto</h3>
                  <div className="space-y-4">
                    <a href={`mailto:${EMAIL}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-wintech-dark">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center"><Mail className="w-5 h-5 text-wintech-dark" /></div>
                      {EMAIL}
                    </a>
                    <a href="https://wa.me/573025847979" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-600 hover:text-wintech-dark">
                      <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center"><Phone className="w-5 h-5 text-green-600" /></div>
                      {WHATSAPP_NUMBER}
                    </a>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center"><MapPin className="w-5 h-5 text-wintech-orange" /></div>
                      Palmira, Valle del Cauca, Colombia
                    </div>
                  </div>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.3}>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="block bg-green-500 hover:bg-green-600 rounded-2xl p-6 text-white text-center transition-colors">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-semibold">Escríbenos por WhatsApp</p>
                  <p className="text-sm text-green-100">Respuesta inmediata</p>
                </a>
              </ScrollAnimation>

              <ScrollAnimation delay={0.4}>
                <div className="rounded-2xl overflow-hidden shadow-md h-[250px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3981!2d-76.310625!3d3.539375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2sco"
                    width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                    title="Mapa WinTech AI"
                  />
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
