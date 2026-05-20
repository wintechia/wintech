'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Zap, Play, MessageCircle } from 'lucide-react';
import { createPortal } from 'react-dom';
import { WHATSAPP_URL } from '@/lib/constants';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/#servicios', label: 'Servicios' },
  { href: '/#planes', label: 'Planes' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/blog', label: 'Blog' },
  { href: '/contacto', label: 'Contacto' },
];

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname() ?? '';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!mounted || !open) return null;

  const menu = (
    <div
      className="fixed inset-0 top-16 bg-white overflow-y-auto md:hidden"
      style={{ zIndex: 9999 }}
    >
      <div className="px-4 py-6 space-y-1">
        {NAV_LINKS?.map((link: any) => (
          <Link
            key={link?.href}
            href={link?.href ?? '/'}
            onClick={onClose}
            className={cn(
              'block px-4 py-3 rounded-xl text-base font-medium transition-colors',
              pathname === link?.href
                ? 'text-wintech-dark bg-wintech-cyan/10'
                : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
            )}
          >
            {link?.label ?? ''}
          </Link>
        ))}
        <div className="pt-4 space-y-3">
          <Link
            href="/demo/clinica-estetica"
            onClick={onClose}
            className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-wintech-dark border-2 border-wintech-cyan text-base"
          >
            <Play className="w-5 h-5" /> Ver Demo en Vivo
          </Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-white bg-wintech-orange text-base"
          >
            <MessageCircle className="w-5 h-5" /> Agendar Consultoría
          </a>
        </div>
      </div>
    </div>
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createPortal(menu as any, document.body) as any;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? '';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 transition-all duration-300',
          scrolled ? 'bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-100/50' : 'bg-white/80 backdrop-blur-lg border-b border-gray-100/50'
        )}
        style={{ zIndex: 10000 }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo - always links to home */}
          <Link href="/" className="flex items-center gap-2 group shrink-0" onClick={() => setOpen(false)}>
            <div className="w-9 h-9 rounded-lg bg-wintech-dark flex items-center justify-center">
              <Zap className="w-5 h-5 text-wintech-cyan" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-wintech-dark">
              Win<span className="text-wintech-cyan">Tech</span> AI
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS?.map((link: any) => (
              <Link
                key={link?.href}
                href={link?.href ?? '/'}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === link?.href
                    ? 'text-wintech-dark bg-wintech-cyan/10'
                    : 'text-gray-600 hover:text-wintech-dark hover:bg-gray-100'
                )}
              >
                {link?.label ?? ''}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/demo/clinica-estetica"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-wintech-dark border-2 border-wintech-cyan hover:bg-wintech-cyan/10 transition-colors"
            >
              Ver Demo
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-wintech-orange hover:bg-orange-600 transition-colors shadow-sm"
            >
              Agendar Consultoría
            </a>
          </div>

          {/* Hamburger Button - Mobile */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            style={{ zIndex: 10001 }}
          >
            {open ? <X className="w-6 h-6 text-wintech-dark" /> : <Menu className="w-6 h-6 text-wintech-dark" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu rendered via portal to avoid z-index issues */}
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
