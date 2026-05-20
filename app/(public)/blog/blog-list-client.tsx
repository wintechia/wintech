'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ScrollAnimation } from '@/components/scroll-animation';
import { BookOpen, Calendar, ArrowRight, Loader2 } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  createdAt: string;
}

export function BlogListClient() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog')
      .then((r: any) => r?.json?.())
      .then((data: any) => setPosts(data?.posts ?? []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="py-16 bg-wintech-dark">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wintech-cyan/20 text-wintech-cyan text-sm mb-4">
              <BookOpen className="w-4 h-4" /> Blog
            </div>
            <h1 className="font-display text-4xl font-bold text-white tracking-tight mb-3">
              Ideas y Estrategias con <span className="text-wintech-cyan">Inteligencia Artificial</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-xl">
              Artículos prácticos sobre cómo la IA puede transformar tu negocio local.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-wintech-dark" />
            </div>
          ) : (posts?.length ?? 0) === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Próximamente publicaremos artículos aquí.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(posts ?? [])?.map((post: BlogPost, i: number) => (
                <ScrollAnimation key={post?.id ?? i} delay={i * 0.1}>
                  <Link href={`/blog/${post?.slug ?? ''}`} className="group block">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 hover:border-wintech-cyan/30 h-full flex flex-col">
                      <div className="h-2 bg-gradient-to-r from-wintech-dark to-wintech-cyan" />
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="inline-block px-2 py-0.5 rounded-full bg-wintech-cyan/10 text-wintech-cyan text-xs font-medium mb-3 w-fit">
                          {post?.category ?? 'IA'}
                        </div>
                        <h2 className="font-display font-bold text-lg text-wintech-dark mb-2 group-hover:text-wintech-cyan transition-colors">
                          {post?.title ?? ''}
                        </h2>
                        <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-4">{post?.excerpt ?? ''}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Calendar className="w-3 h-3" />
                            {post?.createdAt ? new Date(post.createdAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
                          </div>
                          <div className="flex items-center gap-1 text-wintech-orange text-sm font-semibold">
                            Leer <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </ScrollAnimation>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
