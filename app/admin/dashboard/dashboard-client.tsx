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

interface Reserva {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  empresa: string | null;
  nicho: string;
  servicio: string;
  fecha: string;
  hora: string;
  estado: string;
  notas: string | null;
  createdAt: string;
}

export function DashboardClient() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'leads' | 'reservas'>('leads');

  useEffect(() => {
    Promise.all([
      fetch('/api/leads').then((r: any) => r?.json?.()).catch(() => ({ leads: [] })),
      fetch('/api/reservas').then((r: any) => r?.json?.()).catch(() => ({ reservas: [] })),
    ]).then(([leadsData, reservasData]) => {
      setLeads(leadsData?.leads ?? []);
      setReservas(reservasData?.reservas ?? []);
    }).finally(() => setLoading(false));
  }, []);

  const updateReservaEstado = async (id: string, estado: string) => {
    try {
      await fetch('/api/reservas', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, estado }),
      });
      setReservas((prev: Reserva[]) =>
        prev.map((r: Reserva) => r.id === id ? { ...r, estado } : r)
      );
    } catch (error) {
      console.error('Error updating reserva:', error);
    }
  };

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
        {/* Tabs */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'leads' ? 'bg-wintech-dark text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            <Users className="w-4 h-4 inline mr-1" /> Leads ({leads?.length ?? 0})
          </button>
          <button
            onClick={() => setActiveTab('reservas')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'reservas' ? 'bg-wintech-dark text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            <Calendar className="w-4 h-4 inline mr-1" /> Reservas ({reservas?.length ?? 0})
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-wintech-dark" /></div>
        ) : activeTab === 'leads' ? (
          /* LEADS TAB */
          (leads?.length ?? 0) === 0 ? (
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
          )
        ) : (
          /* RESERVAS TAB */
          (reservas?.length ?? 0) === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aún no hay reservas.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {(reservas ?? [])?.map((reserva: Reserva) => (
                <div key={reserva?.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-wintech-dark">{reserva?.nombre ?? 'Sin nombre'}</h3>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-gray-500"><Mail className="w-3 h-3" /> {reserva?.email ?? ''}</span>
                        {reserva?.telefono && <span className="flex items-center gap-1 text-xs text-gray-500"><Phone className="w-3 h-3" /> {reserva.telefono}</span>}
                        {reserva?.empresa && <span className="flex items-center gap-1 text-xs text-gray-500"><Building2 className="w-3 h-3" /> {reserva.empresa}</span>}
                      </div>
                    </div>
                    <select
                      value={reserva?.estado ?? 'pendiente'}
                      onChange={(e) => updateReservaEstado(reserva?.id, e.target.value)}
                      className={`px-2 py-1 rounded-lg text-xs font-medium border-0 cursor-pointer ${reserva?.estado === 'confirmada' ? 'bg-green-100 text-green-700' : reserva?.estado === 'cancelada' ? 'bg-red-100 text-red-700' : reserva?.estado === 'completada' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="confirmada">Confirmada</option>
                      <option value="completada">Completada</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {reserva?.nicho}</span>
                    <span>{reserva?.servicio}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {reserva?.fecha ? new Date(reserva.fecha).toLocaleDateString('es-CO') : ''} a las {reserva?.hora}</span>
                  </div>
                  {reserva?.notas && <p className="text-sm text-gray-600 mt-2 bg-gray-50 rounded-lg p-3">{reserva.notas}</p>}
                </div>
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
}
