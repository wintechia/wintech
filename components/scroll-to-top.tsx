'use client';
import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-24 right-6 z-30 w-11 h-11 rounded-full bg-wintech-dark/80 hover:bg-wintech-dark text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110"
      aria-label="Volver al inicio"
      title="Volver al inicio"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
