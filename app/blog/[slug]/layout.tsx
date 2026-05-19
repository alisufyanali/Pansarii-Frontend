import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { blogPosts } from '@/data/blogposts';

interface Props {
  params: Promise<{ slug: string }>;
  children: ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: 'Blog Post',
      description: 'The blog post you are looking for could not be found.',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | Pansari Inn`,
      description: post.excerpt,
      type: 'article',
      images: post.image ? [{ url: post.image, alt: post.title }] : [],
    },
  };
}

export default function BlogPostLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
