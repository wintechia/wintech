export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ posts: posts ?? [] });
  } catch (error: any) {
    console.error('Blog fetch error:', error);
    return NextResponse.json({ posts: [] });
  }
}
