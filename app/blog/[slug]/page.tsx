import { prisma } from '@/lib/db';
import { BlogPostClient } from './blog-post-client';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params?.slug ?? '' } }).catch(() => null);
  return {
    title: post?.title ?? 'Artículo',
    description: post?.excerpt ?? '',
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params?.slug ?? '' } }).catch(() => null);
  if (!post) return notFound();
  return <BlogPostClient post={JSON.parse(JSON.stringify(post))} />;
}
