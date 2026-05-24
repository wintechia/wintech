import { SERVICES } from '@/lib/constants';
import { ServiceDetailClient } from './service-detail-client';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return (SERVICES ?? [])?.map((s: any) => ({ id: s?.id ?? '' }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const service = (SERVICES ?? [])?.find((s: any) => s?.id === params?.id);
  return {
    title: service?.title ?? 'Servicio',
    description: service?.description ?? '',
  };
}

export default function ServicePage({ params }: { params: { id: string } }) {
  const service = (SERVICES ?? [])?.find((s: any) => s?.id === params?.id);
  if (!service) return notFound();
  return <ServiceDetailClient service={service} />;
}
