import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Seed admin user
  const hashedPassword = await bcrypt.hash('johndoe123', 10);
  await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
    },
  });

  // Seed blog posts
  const blogPosts = [
    {
      title: '¿Por qué el 62% de las llamadas a negocios locales nunca son contestadas?',
      slug: 'llamadas-perdidas-negocios-locales',
      excerpt: 'Descubre por qué la mayoría de negocios locales pierden clientes cada día por no contestar llamadas y cómo la IA puede resolver este problema.',
      content: `<h2>El Problema Silencioso</h2>
<p>Según estudios recientes, <strong>el 62% de las llamadas</strong> que reciben los negocios locales nunca son contestadas. Esto incluye clínicas, consultorios, talleres, bufetes y todo tipo de comercio local.</p>
<p>Cada llamada perdida es potencialmente un cliente que se fue con la competencia. Y lo peor: el 78% de los consumidores compran al primer negocio que les contesta.</p>
<h2>¿Por qué pasa esto?</h2>
<ul>
<li>El dueño está atendiendo a otro cliente</li>
<li>Es hora de almuerzo o fuera de horario laboral</li>
<li>No hay personal dedicado a contestar el teléfono</li>
<li>Las llamadas llegan cuando el negocio está más ocupado</li>
</ul>
<h2>La Solución: Recepcionista de Voz IA</h2>
<p>Una recepcionista virtual con inteligencia artificial puede contestar el 100% de las llamadas, 24 horas al día, 7 días a la semana. Con voz natural, responde preguntas frecuentes y agenda citas automáticamente.</p>
<p>El resultado: <strong>cero llamadas perdidas, más citas agendadas, más ingresos</strong>.</p>`,
      category: 'IA',
      author: 'WinTech AI',
    },
    {
      title: 'Cómo un Chatbot de IA Puede Triplicar tus Citas Agendadas',
      slug: 'chatbot-ia-triplicar-citas',
      excerpt: 'Los chatbots con IA no son el futuro — son el presente. Aprende cómo pueden multiplicar la captación de clientes para tu negocio local.',
      content: `<h2>Más Allá del "Bot" Tradicional</h2>
<p>Cuando pensamos en chatbots, muchos imaginan esos asistentes básicos que solo responden con opciones predefinidas. Los chatbots con IA son completamente diferentes.</p>
<h2>¿Qué puede hacer un Chatbot con IA?</h2>
<ul>
<li><strong>Calificar leads</strong>: Identifica si el visitante es un cliente potencial real</li>
<li><strong>Responder preguntas complejas</strong>: Entrenado con la información específica de tu negocio</li>
<li><strong>Agendar citas</strong>: Se conecta directamente con tu calendario</li>
<li><strong>Disponibilidad 24/7</strong>: Trabaja mientras tú duermes</li>
</ul>
<h2>Resultados Reales</h2>
<p>Negocios que implementan chatbots de IA reportan un aumento promedio del <strong>40% en leads capturados</strong> y un <strong>300% en citas agendadas fuera de horario laboral</strong>.</p>
<p>La razón es simple: el chatbot no descansa, no se distrae y siempre tiene la mejor respuesta.</p>`,
      category: 'Automatización',
      author: 'WinTech AI',
    },
    {
      title: 'SEO Local: Cómo Aparecer Primero Cuando Buscan tu Servicio',
      slug: 'seo-local-aparecer-primero-google',
      excerpt: 'El 46% de las búsquedas en Google tienen intención local. Si no apareces en los primeros resultados, estás regalando clientes a la competencia.',
      content: `<h2>La Oportunidad del SEO Local</h2>
<p>El <strong>46% de todas las búsquedas en Google</strong> tienen intención local. Esto significa que casi la mitad de las personas que buscan algo en Google están buscando un negocio cerca de ellos.</p>
<h2>SEO Local Programático: La Estrategia que Funciona</h2>
<p>En lugar de crear una sola página para tu negocio, el SEO programático crea <strong>páginas individuales optimizadas por servicio + ciudad</strong>.</p>
<p>Por ejemplo, si eres dentista en Palmira, tendrías páginas como:</p>
<ul>
<li>"Ortodoncia en Palmira" - optimizada para esa búsqueda</li>
<li>"Blanqueamiento dental Palmira" - otra página específica</li>
<li>"Implantes dentales cerca de mí" - captura búsquedas de proximidad</li>
</ul>
<h2>Resultados Comprobados</h2>
<p>Los negocios que implementan SEO local programático reportan un aumento del <strong>200-400%</strong> en tráfico orgánico local en los primeros 6 meses.</p>`,
      category: 'SEO',
      author: 'WinTech AI',
    },
    {
      title: 'Reseñas en Google: Por Qué Son el Arma Secreta de los Negocios Exitosos',
      slug: 'resenas-google-arma-secreta',
      excerpt: 'Los negocios con más de 50 reseñas positivas reciben 3 veces más clientes. Aprende cómo automatizar la generación de reseñas.',
      content: `<h2>El Poder de las Reseñas</h2>
<p>Las reseñas en Google no son solo "bonitas de tener". Son un <strong>factor decisivo</strong> en la elección de un negocio local.</p>
<p>Los datos son claros: negocios con más de 50 reseñas positivas reciben <strong>3 veces más clientes</strong> que aquellos con pocas o ninguna reseña.</p>
<h2>El Problema: Nadie Deja Reseñas por Voluntad Propia</h2>
<p>La realidad es que los clientes satisfechos rara vez dejan reseñas por iniciativa propia. Solo los insatisfechos tienden a hacerlo, lo que distorsiona tu reputación online.</p>
<h2>La Solución: Automatización</h2>
<p>Un sistema automatizado de generación de reseñas envía una solicitud amigable a cada cliente después de su visita. El proceso es:</p>
<ol>
<li>El cliente recibe un mensaje automático preguntando por su experiencia</li>
<li>Si la experiencia fue positiva, se le redirige a Google para dejar reseña</li>
<li>Si fue negativa, se captura el feedback internamente para mejora</li>
</ol>`,
      category: 'Reputación',
      author: 'WinTech AI',
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: { title: post.title, excerpt: post.excerpt, content: post.content, category: post.category },
      create: post,
    });
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
