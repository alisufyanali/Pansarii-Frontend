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

// Helper function to strip HTML tags
const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};

// Helper function to truncate text with ellipsis
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export default function BlogCard({ blog }: BlogCardProps) {
  // Clean content by removing HTML tags
  const cleanContent = stripHtmlTags(blog.content);
  
  // Clean title by removing HTML tags
  const cleanTitle = stripHtmlTags(blog.title);

  // Truncate title and content for consistent card heights
  const truncatedTitle = truncateText(cleanTitle, 50);
  const truncatedContent = truncateText(cleanContent, 80);

  return (
    <article className="w-full h-auto rounded-[8px] border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow flex flex-col bg-white max-w-[240px]">
      {/* Image - Ultra compact */}
      <div className="relative w-full aspect-[16/9] mt-1.5 px-1.5">
        <div className="relative w-full h-full rounded-[6px] overflow-hidden">
          <Image
            src={blog.image}
            alt={cleanTitle}
            fill
            className="object-cover"
            sizes="240px"
            loading="lazy"
          />
        </div>
      </div>

      {/* Content - Minimum padding and smallest fonts */}
      <div className="p-2.5 flex flex-col flex-grow">
        <h3 className="font-poppins font-semibold text-xs md:text-sm leading-tight capitalize mb-1 line-clamp-2">
          {truncatedTitle}
        </h3>
        <p className="font-poppins font-normal text-[11px] md:text-xs leading-relaxed capitalize mb-2 line-clamp-2 text-gray-600">
          {truncatedContent}
        </p>
        <Link
          href={`/blog/${blog.slug}`}
          className="font-poppins font-medium text-[11px] md:text-xs underline capitalize hover:text-blue-600 transition-colors inline-flex items-center mt-auto text-blue-500"
        >
          Read More
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-3 w-3 ml-0.5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}