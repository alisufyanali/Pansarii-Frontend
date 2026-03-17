"use client";

import { blogPosts } from '../data/blogposts';
import BlogCard from '../components/BlogCard';
import Link from 'next/link';

export default function Blog() {
  const latestBlogs = blogPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <section className="my-10 mx-[4%]">
      <div className="max-w-[1920px] mx-auto">

        {/* Heading row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Wellness Blog</h2>
            <p className="text-xs text-gray-500 mt-0.5">Health tips, wellness advice, and natural remedies</p>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-green-700 text-white text-xs font-semibold rounded-lg hover:bg-green-800 transition-colors"
          >
            View All Articles
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 2xl:gap-5">
          {latestBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>

        {/* View all — mobile only */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/blog"
            className="inline-block px-6 py-2.5 border border-green-700 text-green-700 text-xs font-semibold rounded-lg hover:bg-green-50 transition-colors"
          >
            See All Articles
          </Link>
        </div>

      </div>
    </section>
  );
}