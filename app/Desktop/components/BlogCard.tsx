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

// Optional: Helper function to truncate text with ellipsis
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export default function BlogCard({ blog }: BlogCardProps) {
  // Clean content by removing HTML tags
  const cleanContent = stripHtmlTags(blog.content);
  
  // Clean title by removing HTML tags
  const cleanTitle = stripHtmlTags(blog.title);

  return (
    <article className="w-full h-auto rounded-[14px] border border-gray-300 overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      {/* Image - Responsive container */}
      <div className="relative w-full aspect-[384/217] mt-4 px-4">
        <div className="relative w-full h-full rounded-[14px] overflow-hidden">
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

      {/* Content - Responsive padding and text */}
      <div className="p-4 md:p-5 lg:p-6 2xl:p-8 flex flex-col flex-grow">
        <h3 className="font-poppins font-semibold text-lg md:text-xl lg:text-2xl 2xl:text-3xl leading-tight capitalize mb-2 line-clamp-2">
          {cleanTitle}
        </h3>
        <p className="font-poppins font-normal text-sm md:text-base lg:text-lg 2xl:text-xl leading-relaxed capitalize mb-4 line-clamp-3">
          {cleanContent}
        </p>
        <Link
          href={`/blog/${blog.slug}`}
          className="font-poppins font-medium text-base md:text-lg lg:text-xl 2xl:text-2xl underline capitalize hover:text-blue-600 transition-colors inline-flex items-center mt-auto"
        >
          Read More
          <span className="ml-2">→</span>
        </Link>
      </div>
    </article>
  );
}