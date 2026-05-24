import { NICHOS } from '@/lib/constants';
import { DemoPageClient } from './_components/demo-page-client';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return (NICHOS ?? [])?.map((n: any) => ({ nicho: n?.id ?? '' }));
}

export function generateMetadata({ params }: { params: { nicho: string } }) {
  const nicho = (NICHOS ?? [])?.find((n: any) => n?.id === params?.nicho);
  return {
    title: nicho ? `Demo IA para ${nicho?.title}` : 'Demo',
    description: nicho?.description ?? 'Prueba nuestro chatbot de IA en vivo',
  };
}

export default function DemoPage({ params }: { params: { nicho: string } }) {
  const nicho = (NICHOS ?? [])?.find((n: any) => n?.id === params?.nicho);
  if (!nicho) return notFound();
  return <DemoPageClient nicho={nicho} allNichos={NICHOS ?? []} />;
}
