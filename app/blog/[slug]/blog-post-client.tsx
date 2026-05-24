'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, BookOpen } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  createdAt: string;
}

export function BlogPostClient({ post }: { post: Post }) {
  return (
    <div className="py-8">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-wintech-dark mb-8">
          <ArrowLeft className="w-4 h-4" /> Volver al blog
        </Link>

        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-block px-3 py-1 rounded-full bg-wintech-cyan/10 text-wintech-cyan text-xs font-medium mb-4">
            {post?.category ?? 'IA'}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-wintech-dark tracking-tight mb-4">
            {post?.title ?? ''}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b">
            <div className="flex items-center gap-1"><User className="w-4 h-4" /> {post?.author ?? 'WinTech AI'}</div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {post?.createdAt ? new Date(post.createdAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
            </div>
          </div>
          <div className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: post?.content ?? '' }} />
        </motion.article>
      </div>
    </div>
  );
}
