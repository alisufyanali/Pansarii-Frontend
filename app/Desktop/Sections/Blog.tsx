// app/Desktop/Sections/Blog.tsx
"use client";

import { blogPosts } from '../data/blogposts';
import BlogCard from '../components/BlogCard';
import Link from 'next/link';

export default function Blog() {
  const latestBlogs = blogPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <section className="my-16 mx-[4%]">
      <div className="max-w-[1920px] mx-auto">
        {/* Heading */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h2 className="font-poppins font-semibold text-3xl md:text-4xl 2xl:text-5xl text-gray-900 mb-2">
              Wellness Blog
            </h2>
            <p className="text-gray-600 2xl:text-lg">
              Health tips, wellness advice, and natural remedies
            </p>
          </div>
          <Link
            href="/blog"
            className="mt-4 md:mt-0 px-6 py-2.5 2xl:px-8 2xl:py-3 bg-green-700 text-white font-medium rounded-lg hover:bg-green-800 transition-colors inline-flex items-center gap-2 2xl:text-lg"
          >
            View All Articles
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Blog Cards — 3 columns on laptop, 3 on 2xl/4K (fills container) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 2xl:gap-8">
          {latestBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>

        {/* View All (Mobile) */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/blog"
            className="inline-block px-8 py-3 border border-green-700 text-green-700 font-medium rounded-lg hover:bg-green-50 transition-colors"
          >
            See All Articles
          </Link>
        </div>
      </div>
    </section>
  );
}