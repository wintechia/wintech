import { DM_Sans, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/sonner';
import { ChunkLoadErrorHandler } from '@/components/chunk-load-error-handler';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ScrollToTop } from '@/components/scroll-to-top';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { ChatbotWidget } from '@/components/chatbot-widget';
import Script from 'next/script';

export const dynamic = 'force-dynamic';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' });
const jakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-display' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export async function generateMetadata() {
  const siteUrl = process.env.NEXTAUTH_URL || 'https://wintech.agency';
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: 'WinTech AI — Multiplica tus Ventas con Inteligencia Artificial',
      template: '%s | WinTech AI',
    },
    description: 'Agencia de servicios recurrentes con IA en Palmira, Valle del Cauca. Chatbots, recepcionista de voz, SEO local y automatización para negocios locales.',
    keywords: ['IA', 'inteligencia artificial', 'chatbot', 'automatización', 'Palmira', 'Valle del Cauca', 'Colombia', 'negocios locales', 'marketing digital'],
    authors: [{ name: 'WinTech AI' }],
    creator: 'WinTech AI',
    openGraph: {
      type: 'website',
      locale: 'es_CO',
      url: siteUrl,
      siteName: 'WinTech AI',
      title: 'WinTech AI — Multiplica tus Ventas con Inteligencia Artificial',
      description: 'Convierte tu negocio en una máquina de generar clientes con IA que trabaja 24/7.',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'WinTech AI' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'WinTech AI — Multiplica tus Ventas con IA',
      description: 'Agencia de servicios recurrentes con IA en Colombia.',
      images: ['/og-image.png'],
    },
    icons: {
      icon: '/favicon.svg',
      shortcut: '/favicon.svg',
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <Script src="https://apps.abacus.ai/chatllm/appllm-lib.js" strategy="afterInteractive" />
      </head>
      <body className={`${dmSans.variable} ${jakartaSans.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <Providers>
          <SiteHeader />
          <main className="min-h-screen pt-16">{children}</main>
          <SiteFooter />
          <Toaster />
          <ChunkLoadErrorHandler />
          <ScrollToTop />
          <WhatsAppButton />
          <ChatbotWidget />
        </Providers>
      </body>
    </html>
  );
}
