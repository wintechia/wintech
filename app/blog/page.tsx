import { BlogListClient } from './blog-list-client';

export const metadata = {
  title: 'Blog',
  description: 'Artículos sobre IA, automatización y cómo multiplicar las ventas de tu negocio local.',
};

export default function BlogPage() {
  return <BlogListClient />;
}
