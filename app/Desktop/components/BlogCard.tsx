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
    <article
      className="w-full rounded-[14px] border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col bg-white"
      style={{ height: '42vh', minHeight: '240px', maxHeight: '360px' }}
    >
      {/* Image — fixed portion of card height */}
      <div className="relative w-full flex-shrink-0 px-3 pt-3" style={{ height: '50%' }}>
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

      {/* Content — fills remaining space */}
      <div className="flex flex-col flex-1 p-3 min-h-0 overflow-hidden">
        {/* Title - 2 lines max with ellipsis */}
        <h3 
          className="text-sm font-semibold text-gray-900 leading-snug mb-1 flex-shrink-0"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {cleanTitle}
        </h3>
        
        {/* Content - 3 lines max with ellipsis */}
        <p 
          className="text-xs text-gray-500 leading-relaxed flex-1 mb-2"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {cleanContent}
        </p>
        
        {/* Read More Link */}
        <Link
          href={`/blog/${blog.slug}`}
          className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-green-700 hover:text-green-600 transition-colors"
        >
          Read More <span>→</span>
        </Link>
      </div>
    </article>
  );
}