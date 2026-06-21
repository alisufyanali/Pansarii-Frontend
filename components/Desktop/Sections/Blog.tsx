"use client";

import { blogPosts } from '../../../data/blogposts';
import BlogCard from '../components/BlogCard';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getBlogs, type ApiBlog } from '@/lib/blog';

interface BlogCardItem {
  id: string | number;
  image: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  date?: string;
  readTime?: string;
  category?: string;
}

const DEFAULT_BLOGS: BlogCardItem[] = [...blogPosts]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 2)
  .map(post => ({
    id: post.id,
    image: post.image,
    title: post.title,
    content: post.content,
    excerpt: post.excerpt,
    slug: post.slug,
    date: post.date,
    readTime: post.readTime,
    category: post.category,
  }));

function mapApiBlogToCard(blog: ApiBlog): BlogCardItem {
  return {
    id: blog.id,
    image: blog.thumbnail || '/images/product.png',
    title: blog.title,
    content: blog.excerpt,
    excerpt: blog.excerpt,
    slug: blog.slug,
    date: blog.created_at,
    category: blog.category?.name,
  };
}

function BlogSkeleton() {
  return (
    <section className="mx-[4%] my-8">
      <div className="max-w-[1920px] mx-auto">
        <div className="mb-5 h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-72 bg-gray-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Blog() {
  const [blogs, setBlogs] = useState<BlogCardItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogs({ per_page: 4 })
      .then(res => {
        const mapped = (res.data ?? []).map(mapApiBlogToCard);
        setBlogs(mapped.length > 0 ? mapped : null);
      })
      .catch(() => setBlogs(null))
      .finally(() => setLoading(false));
  }, []);

  const displayBlogs = (blogs ?? DEFAULT_BLOGS).slice(0, 3);

  if (loading) return <BlogSkeleton />;

  return (
    <section className="mx-[4%] my-8">
      <div className="max-w-[1920px] mx-auto">

        {/* Header — consistent with other sections */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl lg:text-3xl 2xl:text-4xl font-semibold">
              Wellness <span className="me-color-y">Blog</span>
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Health tips, wellness advice, and natural remedies
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2 bg-green-700 text-white text-sm font-semibold rounded-full hover:bg-green-800 transition-colors"
          >
            View All Articles
            <span className="text-base">›</span>
          </Link>
        </div>

        {/* 3-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 2xl:gap-6">
          {displayBlogs.map(blog => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>

      </div>
    </section>
  );
}
