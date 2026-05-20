'use client';
import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { Zap, Users, LogOut, Loader2, Mail, Phone, Building2, Calendar, Tag } from 'lucide-react';

interface Lead {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  empresa: string | null;
  nicho: string | null;
  planInteres: string | null;
  mensaje: string | null;
  fuente: string;
  estado: string;
  createdAt: string;
}

export function DashboardClient() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leads')
      .then((r: any) => r?.json?.())
      .then((data: any) => setLeads(data?.leads ?? []))
      .catch(() => setLeads([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-wintech-dark">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-wintech-cyan/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-wintech-cyan" />
            </div>
            <span className="font-display font-bold text-white">Panel Admin</span>
          </div>
          <button onClick={() => signOut?.({ callbackUrl: '/' })} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" /> Salir
          </button>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-wintech-dark">Leads Capturados</h1>
            <p className="text-sm text-gray-500">{leads?.length ?? 0} leads en total</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-wintech-cyan/10 text-wintech-cyan text-sm font-medium">
            <Users className="w-4 h-4" /> {leads?.length ?? 0}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-wintech-dark" /></div>
        ) : (leads?.length ?? 0) === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aún no hay leads capturados.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {(leads ?? [])?.map((lead: Lead) => (
              <div key={lead?.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-wintech-dark">{lead?.nombre ?? 'Sin nombre'}</h3>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-gray-500"><Mail className="w-3 h-3" /> {lead?.email ?? ''}</span>
                      {lead?.telefono && <span className="flex items-center gap-1 text-xs text-gray-500"><Phone className="w-3 h-3" /> {lead.telefono}</span>}
                      {lead?.empresa && <span className="flex items-center gap-1 text-xs text-gray-500"><Building2 className="w-3 h-3" /> {lead.empresa}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${lead?.estado === 'nuevo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {lead?.estado ?? 'nuevo'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${lead?.fuente === 'demo' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                      {lead?.fuente ?? 'contacto'}
                    </span>
                  </div>
                </div>
                {lead?.mensaje && <p className="text-sm text-gray-600 mb-2 bg-gray-50 rounded-lg p-3">{lead.mensaje}</p>}
                <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                  {lead?.nicho && <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {lead.nicho}</span>}
                  {lead?.planInteres && <span>Plan: {lead.planInteres}</span>}
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {lead?.createdAt ? new Date(lead.createdAt).toLocaleDateString('es-CO') : ''}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
