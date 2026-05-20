import { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { SERVICES, NICHOS } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export default function sitemap(): MetadataRoute.Sitemap {
  const headersList = headers();
  const host = headersList?.get?.('x-forwarded-host') ?? '';
  const siteUrl = host ? `https://${host}` : (process.env.NEXTAUTH_URL ?? 'https://wintech.agency');

  const staticPages = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${siteUrl}/nosotros`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${siteUrl}/contacto`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
  ];

  const servicePages = (SERVICES ?? [])?.map((s: any) => ({
    url: `${siteUrl}/servicios/${s?.id ?? ''}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const demoPages = (NICHOS ?? [])?.map((n: any) => ({
    url: `${siteUrl}/demo/${n?.id ?? ''}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...servicePages, ...demoPages];
}
