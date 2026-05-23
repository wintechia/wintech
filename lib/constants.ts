export const SITE_NAME = "WinTech AI";
export const API_BASE = "/api";

export const EMAIL = "wintech.ia@gmail.com";
export const WHATSAPP_NUMBER = "+573025847979";
export const WHATSAPP_URL = `https://wa.me/573025847979?text=${encodeURIComponent("Hola, me interesa conocer más sobre WinTech AI")}`;

export const SERVICES = [
  {
    id: "chatbot-ia",
    title: "Chatbot IA",
    description: "Atención automática 24/7 para WhatsApp y tu web. Califica leads y agenda citas sin intervención humana.",
    icon: "MessageSquare",
    image: "/images/services/chatbot.jpg",
    benefits: [
      "Atención 24/7 sin interrupciones",
      "Calificación automática de leads",
      "Agendamiento de citas integrado",
      "Reduce hasta 70% de consultas repetitivas",
      "Transferencia inteligente a humano",
    ],
    roi: "Nuestros clientes ven un incremento del 35-50% en citas agendadas y reducen costos de recepción en un 60%.",
    precio: "Desde $497.000/mes",
  },
  {
    id: "recepcionista-voz",
    title: "Recepcionista de Voz IA",
    description: "Wincho AI atiende llamadas, agenda citas y responde preguntas frecuentes con voz natural.",
    icon: "Phone",
    image: "/images/services/voz-ia.jpg",
    benefits: [
      "Atención telefónica 24/7",
      "Voz natural en español colombiano",
      "Agendamiento automático de citas",
      "Integración con Google Calendar",
      "Nunca pierde una llamada",
    ],
    roi: "Recupera el 80% de llamadas perdidas que antes se iban a la competencia. ROI positivo en semana 1.",
    precio: "Desde $797.000/mes",
  },
  {
    id: "automatizacion",
    title: "Automatización de Marketing",
    description: "Secuencias de seguimiento por email y WhatsApp que convierten leads en clientes.",
    icon: "Zap",
    image: "/images/services/automatizacion.jpg",
    benefits: [
      "Secuencias de email personalizadas",
      "Campañas de WhatsApp masivas",
      "Recordatorios automáticos de citas",
      "Reportes de conversión en tiempo real",
      "Integración con CRM",
    ],
    roi: "Aumenta la conversión de leads en clientes hasta un 45% con seguimiento automático.",
    precio: "Desde $397.000/mes",
  },
  {
    id: "seo-local",
    title: "SEO Local + Google Business",
    description: "Posiciona tu negocio en Google Maps y búsquedas locales para atraer clientes cercanos.",
    icon: "MapPin",
    image: "/images/services/seo-local.jpg",
    benefits: [
      "Optimización de Google Business Profile",
      "Gestión y respuesta de reseñas",
      "Contenido optimizado para búsquedas locales",
      "Reportes mensuales de posicionamiento",
      "Estrategia de backlinks locales",
    ],
    roi: "Aparece en el 87% de las búsquedas locales de tus clientes potenciales. Aumenta visitas web un 200%.",
    precio: "Desde $297.000/mes",
  },
];

export const NICHOS = [
  {
    id: "clinica-estetica",
    title: "Clínicas Estéticas",
    description: "Agenda citas automáticas, envía recordatorios pre/post procedimiento y captura leads de Instagram.",
    icon: "Sparkles",
    color: "from-pink-500 to-rose-500",
    image: "/images/nichos/clinica-estetica.jpg",
    chatPrompt: "clinica-estetica",
  },
  {
    id: "dentistas",
    title: "Consultorios Dentales",
    description: "Reduce inasistencias con recordatorios inteligentes y atiende consultas fuera de horario.",
    icon: "Smile",
    color: "from-blue-500 to-cyan-500",
    image: "/images/nichos/dentista.jpg",
    chatPrompt: "dentistas",
  },
  {
    id: "abogados",
    title: "Bufetes de Abogados",
    description: "Captura consultas urgentes 24/7, clasifica casos potenciales y agenda consultas iniciales.",
    icon: "Scale",
    color: "from-amber-500 to-orange-500",
    image: "/images/nichos/abogados.jpg",
    chatPrompt: "abogados",
  },
  {
    id: "talleres",
    title: "Talleres Mecánicos",
    description: "Agenda servicios, envía recordatorios de mantenimiento y responde consultas sobre precios.",
    icon: "Wrench",
    color: "from-green-500 to-emerald-500",
    image: "/images/nichos/taller.jpg",
    chatPrompt: "talleres",
  },
  {
    id: "inmobiliarios",
    title: "Inmobiliarias",
    description: "Atiende consultas de propiedades fuera de horario, agenda visitas y captura datos de compradores.",
    icon: "Building",
    color: "from-purple-500 to-violet-500",
    image: "/images/nichos/inmobiliaria.jpg",
    chatPrompt: "inmobiliarios",
  },
];

export const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "$497",
    period: "/mes",
    description: "Para negocios que empiezan con IA",
    features: [
      "Chatbot WhatsApp básico",
      "1 nicho configurado",
      "500 conversaciones/mes",
      "Soporte por email",
      "Reportes básicos",
    ],
    highlighted: false,
    cta: "Comenzar",
  },
  {
    id: "growth",
    name: "Growth",
    price: "$997",
    period: "/mes",
    description: "Para negocios en crecimiento",
    features: [
      "Chatbot WhatsApp avanzado",
      "Recepcionista de voz (Wincho AI)",
      "3 nichos configurados",
      "Conversaciones ilimitadas",
      "Automatización de marketing",
      "Soporte prioritario",
      "Reportes avanzados",
    ],
    highlighted: true,
    cta: "Más Popular",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Personalizado",
    period: "",
    description: "Para operaciones a escala",
    features: [
      "Todo de Growth",
      "Nichos ilimitados",
      "API personalizada",
      "Integraciones custom",
      "Account manager dedicado",
      "SLA garantizado",
      "Onboarding presencial",
    ],
    highlighted: false,
    cta: "Contáctanos",
  },
];

export const TESTIMONIALS = [
  {
    name: "Dra. María Fernanda",
    role: "Clínica Estética Vitalidad",
    text: "Desde que implementamos el chatbot, agendamos 40% más citas. Los pacientes pueden reservar a cualquier hora sin esperar.",
    rating: 5,
  },
  {
    name: "Carlos Andrés Gómez",
    role: "Bufete Legal & Asociados",
    text: "Wincho AI atiende nuestras llamadas fuera de horario. Hemos capturado consultas que antes se perdían los fines de semana.",
    rating: 5,
  },
  {
    name: "Ana Lucía Restrepo",
    role: "Centro Odontológico Sonrisas",
    text: "Los recordatorios automáticos redujeron nuestras inasistencias en un 60%. El ROI se pagó en el primer mes.",
    rating: 5,
  },
];
