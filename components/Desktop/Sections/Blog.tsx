"use client";

import Link from 'next/link';
import { blogPosts } from '../../../data/blogposts';
import BlogCard from '../components/BlogCard';
import { type ApiBlog } from '@/lib/blog';

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

export default function Blog({ posts }: { posts?: ApiBlog[] }) {
  const displayBlogs = ((posts && posts.length > 0 ? posts.map(mapApiBlogToCard) : DEFAULT_BLOGS)).slice(0, 3);

  if (displayBlogs.length === 0) return null;

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
