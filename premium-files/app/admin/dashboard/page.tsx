"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, MessageSquare, Users, Calendar,
  TrendingUp, Settings, LogOut, Send, Bot, Phone,
  Star, Eye, ArrowUpRight, Clock
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    document.cookie = "next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/admin/login");
    router.refresh();
  };

  const statCards = [
    { label: "Leads Totales", value: 12, icon: Users, color: "bg-blue-500", change: "+12%" },
    { label: "Conversaciones", value: 48, icon: MessageSquare, color: "bg-green-500", change: "+24%" },
    { label: "Citas Agendadas", value: 8, icon: Calendar, color: "bg-purple-500", change: "+8%" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-wintech-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-display font-bold text-xl text-gray-800">
            Win<span className="text-wintech-cyan">Tech</span> AI - Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 flex items-center gap-1">
              <Eye className="w-4 h-4" /> Ver Sitio
            </a>
            <button onClick={handleLogout} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 flex items-center gap-1">
              <LogOut className="w-4 h-4" /> Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {statCards.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className={"w-10 h-10 rounded-lg " + stat.color + " flex items-center justify-center"}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-green-500 text-xs font-medium">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Wincho AI Status */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-display font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-wintech-cyan" />
            Wincho AI - Asistente de Voz
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-green-700 text-sm font-medium">Estado</p>
              <p className="text-green-800 text-lg font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Activo
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-blue-700 text-sm font-medium">Llamadas Hoy</p>
              <p className="text-blue-800 text-lg font-bold">8</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-purple-700 text-sm font-medium">Leads Capturados</p>
              <p className="text-purple-800 text-lg font-bold">3</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-display font-bold text-lg text-gray-800 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 text-left">
              <Send className="w-5 h-5 text-wintech-cyan mb-2" />
              <p className="font-medium text-sm">Enviar Demo</p>
            </button>
            <button className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 text-left">
              <MessageSquare className="w-5 h-5 text-wintech-cyan mb-2" />
              <p className="font-medium text-sm">Ver Chats</p>
            </button>
            <button className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 text-left">
              <Calendar className="w-5 h-5 text-wintech-cyan mb-2" />
              <p className="font-medium text-sm">Agendar Cita</p>
            </button>
            <button className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 text-left">
              <Star className="w-5 h-5 text-wintech-cyan mb-2" />
              <p className="font-medium text-sm">Solicitar Reseña</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
