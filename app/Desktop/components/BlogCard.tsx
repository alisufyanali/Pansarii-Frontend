import Link from 'next/link';
import Image from 'next/image';

interface Blog {
  id:       string | number;
  image:    string;
  title:    string;
  content:  string;
  excerpt?: string;
  slug:     string;
  date?:    string;
  readTime?: string;
  category?: string;
  author?: { name: string };
}

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '');

export default function BlogCard({ blog }: { blog: Blog }) {
  const title   = stripHtml(blog.title);
  const excerpt = blog.excerpt || stripHtml(blog.content).slice(0, 120) + '…';

  return (
    <article className="group w-full rounded-2xl border border-gray-200 overflow-hidden bg-white hover:shadow-lg hover:border-green-200 transition-all duration-300 flex flex-col">

      {/* Image */}
      <Link href={`/blog/${blog.slug}`} className="block relative w-full aspect-video overflow-hidden flex-shrink-0">
        <Image
          src={blog.image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
        />
        {/* Category badge */}
        {blog.category && (
          <span className="absolute top-3 left-3 text-[11px] font-semibold bg-green-700 text-white px-2.5 py-1 rounded-full">
            {blog.category}
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">

        {/* Meta */}
        <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-2">
          {blog.date && (
            <span>{new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          )}
          {blog.readTime && (
            <>
              <span>·</span>
              <span>{blog.readTime}</span>
            </>
          )}
          {blog.author?.name && (
            <>
              <span>·</span>
              <span>{blog.author.name}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-green-700 transition-colors">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1">
          {excerpt}
        </p>

        {/* Read more */}
        <Link
          href={`/blog/${blog.slug}`}
          className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-green-700 hover:text-green-600 transition-colors group/link"
        >
          Read More
          <span className="group-hover/link:translate-x-1 transition-transform">→</span>
        </Link>

      </div>
    </article>
  );
}
