// app/blog/[slug]/page.tsx
// Server Component — no "use client", no useParams, no fake loading delay.
// generateMetadata is handled by layout.tsx in this directory.

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";
import { blogPosts } from "@/data/blogposts";
import { FaCalendar, FaClock, FaTag, FaArrowRight } from "react-icons/fa";
import { BackButton, MobileShareButton, DesktopShareBar } from "./BlogDetailClient";

// ── Types ─────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ── Static params — pre-render all blog posts at build time ───────────────────

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  // Triggers the nearest not-found.tsx (or root not-found.tsx)
  if (!post) notFound();

  const relatedPosts = blogPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-white">

      {/* ── Sticky top nav ── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          {/* Client component — needs useRouter */}
          <BackButton />
          {/* Client component — needs useState for dropdown */}
          <MobileShareButton title={post.title} />
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Category badge */}
        <div className="mb-4">
          <span className="px-3 py-1.5 bg-green-100 text-green-800 text-xs font-bold rounded-full uppercase tracking-wide">
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-5 leading-tight">
          {post.title}
        </h1>

        {/* Author row + desktop share */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7 pb-7 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={42}
              height={42}
              className="rounded-full border-2 border-green-100"
            />
            <div>
              <p className="font-semibold text-gray-900 text-sm">{post.author.name}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                <span className="flex items-center gap-1">
                  <FaCalendar className="text-[#197B33]" />
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <FaClock className="text-[#197B33]" />
                  {post.readTime}
                </span>
              </div>
            </div>
          </div>

          {/* Client component — share URLs need window.location */}
          <DesktopShareBar title={post.title} />
        </div>

        {/* Featured image — use fill + sized container to avoid layout shift */}
        <div className="relative w-full h-56 sm:h-80 md:h-[420px] mb-8 sm:mb-10 rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 896px"
            priority
          />
        </div>

        {/* Article content — rendered from HTML string */}
        <div
          className="prose prose-sm sm:prose-base prose-green max-w-none mb-10
                     prose-headings:font-bold prose-headings:text-gray-900
                     prose-a:text-[#197B33] prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
        />

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-gray-100">
          <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
            <FaTag />
            Tags:
          </span>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium
                         hover:bg-green-100 hover:text-[#197B33] transition-colors cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Author bio card */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 sm:p-7 mb-10 border border-green-100">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={72}
              height={72}
              className="rounded-full border-2 border-white shadow-md flex-shrink-0"
            />
            <div>
              <p className="text-xs font-bold text-[#197B33] uppercase tracking-wide mb-1">
                About the Author
              </p>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                {post.author.name}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{post.author.bio}</p>
            </div>
          </div>
        </div>

        {/* Related articles */}
        {relatedPosts.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Related Articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className="group flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-4
                             hover:shadow-md transition-all hover:border-green-200"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={related.image}
                      alt={related.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#197B33] transition-colors line-clamp-2 mb-1">
                      {related.title}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {new Date(related.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <FaArrowRight className="text-xs text-gray-300 group-hover:text-[#197B33] flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 bg-[#197B33] text-white
                       font-semibold rounded-full hover:bg-[#156529] transition-colors
                       text-sm sm:text-base shadow-lg shadow-green-200"
          >
            Explore More Articles
            <FaArrowRight className="text-xs" />
          </Link>
        </div>

      </article>
    </div>
  );
}
