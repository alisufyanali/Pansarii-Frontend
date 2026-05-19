"use client";

import { blogPosts } from '../../../data/blogposts';
import BlogCard from '../components/BlogCard';
import Link from 'next/link';

export default function Blog() {
  const latestBlogs = [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

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
          {latestBlogs.map(blog => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>

      </div>
    </section>
  );
}
