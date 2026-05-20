import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { ChatbotWidget } from '@/components/chatbot-widget';
import { ScrollToTop } from '@/components/scroll-to-top';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen pt-16">{children}</main>
      <SiteFooter />
      <ScrollToTop />
      <WhatsAppButton />
      <ChatbotWidget />
    </>
  );
}
