"use client";

import Link from 'next/link';
import Image from 'next/image';
import { FiChevronRight } from 'react-icons/fi';
import { blogPosts } from '@/data/blogposts';
import { type ApiBlog } from '@/lib/blog';

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '');

interface BlogCardItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
}

const DEFAULT_BLOGS: BlogCardItem[] = [...blogPosts]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 2)
  .map(post => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    image: post.image,
  }));

function mapApiBlogToCard(blog: ApiBlog): BlogCardItem {
  return {
    id: blog.id,
    slug: blog.slug,
    title: blog.title,
    excerpt: blog.excerpt,
    content: blog.excerpt,
    image: blog.thumbnail || '/images/product.png',
  };
}

export default function MobileBlogSection({ posts }: { posts?: ApiBlog[] }) {
  const displayBlogs = ((posts && posts.length > 0 ? posts.map(mapApiBlogToCard) : DEFAULT_BLOGS)).slice(0, 2);

  if (displayBlogs.length === 0) return null;

  return (
    <section className="py-4 px-4">

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-gray-900">
          Wellness <span className="me-color-y">Blog</span>
        </h2>
        <Link href="/blog" className="flex items-center gap-0.5 text-sm text-gray-500 font-medium">
          View all <FiChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {displayBlogs.map(post => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm active:scale-[0.98] transition-transform"
          >
            <div className="relative w-full aspect-video overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover group-active:scale-105 transition-transform duration-300"
                sizes="50vw"
                loading="lazy"
              />
            </div>

            <div className="p-2.5">
              <h3 className="text-[11px] font-bold text-gray-900 uppercase leading-snug line-clamp-2 mb-1">
                {stripHtml(post.title)}
              </h3>
              <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-3">
                {post.excerpt || stripHtml(post.content).slice(0, 80)}
              </p>
            </div>
          </Link>
        ))}
      </div>

    </section>
  );
}
