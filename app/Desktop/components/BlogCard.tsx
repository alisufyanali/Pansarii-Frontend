import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Blog {
  id: string | number;
  image: string;
  title: string;
  content: string;
  slug: string;
}

interface BlogCardProps {
  blog: Blog;
}

const stripHtmlTags = (html: string): string => html.replace(/<[^>]*>/g, '');

export default function BlogCard({ blog }: BlogCardProps) {
  const cleanContent = stripHtmlTags(blog.content);
  const cleanTitle   = stripHtmlTags(blog.title);

  return (
    <article className="w-full rounded-[14px] border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col bg-white h-auto">
      {/* Image — fixed aspect ratio */}
      <div className="relative w-full aspect-video flex-shrink-0 px-3 pt-3">
        <div className="relative w-full h-full rounded-[10px] overflow-hidden">
          <Image
            src={blog.image}
            alt={cleanTitle}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col p-3 pb-4">
        {/* Title - FIXED: Now shows ellipsis properly */}
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {cleanTitle}
        </h3>
        
        {/* Content - FIXED: Now shows ellipsis properly */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-3 leading-relaxed">
          {cleanContent}
        </p>
        
        {/* Read More Link */}
        <Link
          href={`/blog/${blog.slug}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:text-green-600 transition-colors group"
        >
          Read More 
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </article>
  );
}