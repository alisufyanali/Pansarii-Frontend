// app/blog/[slug]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/components/Desktop/data/blogposts";
import { 
  FaCalendar, 
  FaClock,
  FaTag,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaArrowLeft,
  FaArrowRight,
  FaShare
} from "react-icons/fa";

function BlogDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      <div className="bg-gray-50 border-b px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="h-5 bg-gray-200 rounded w-20" />
        </div>
      </div>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-28 h-7 bg-gray-200 rounded-full mb-5" />
        <div className="h-9 bg-gray-300 rounded w-full mb-3" />
        <div className="h-9 bg-gray-300 rounded w-4/5 mb-7" />
        <div className="flex items-center gap-4 mb-8 pb-6 border-b">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-3 bg-gray-200 rounded w-48" />
          </div>
        </div>
        <div className="w-full h-64 sm:h-96 bg-gray-300 rounded-2xl mb-8" />
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2 mb-4">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-11/12" />
            <div className="h-4 bg-gray-200 rounded w-4/5" />
          </div>
        ))}
      </article>
    </div>
  );
}

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [isLoading, setIsLoading] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  const post = blogPosts.find(p => p.slug === slug);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <BlogDetailSkeleton />;

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h1>
          <p className="text-gray-500 mb-6 text-sm">The blog post you're looking for doesn't exist.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#197B33] text-white rounded-full text-sm font-semibold hover:bg-[#156529] transition-colors">
            <FaArrowLeft className="text-xs" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const relatedPosts = blogPosts.filter(p => p.id !== post.id && p.category === post.category).slice(0, 2);

  const socialShares = [
    { icon: FaFacebook, label: "Facebook", color: "bg-blue-600", href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}` },
    { icon: FaTwitter, label: "Twitter", color: "bg-sky-500", href: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${post.title}` },
    { icon: FaLinkedin, label: "LinkedIn", color: "bg-blue-700", href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}` },
    { icon: FaWhatsapp, label: "WhatsApp", color: "bg-green-600", href: `https://wa.me/?text=${post.title} ${shareUrl}` },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Back nav */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-[#197B33] transition-colors text-sm font-medium"
          >
            <FaArrowLeft className="text-xs" />
            <span>Back to Blog</span>
          </button>

          {/* Mobile share button */}
          <div className="relative sm:hidden">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-[#197B33] rounded-full text-xs font-semibold"
            >
              <FaShare className="text-xs" />
              Share
            </button>
            {showShareMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border p-3 flex gap-2 z-20">
                {socialShares.map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                    className={`w-8 h-8 ${s.color} text-white rounded-full flex items-center justify-center`}
                  >
                    <s.icon className="text-xs" />
                  </a>
                ))}
              </div>
            )}
          </div>
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

        {/* Meta + share row */}
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
                  {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1">
                  <FaClock className="text-[#197B33]" />
                  {post.readTime}
                </span>
              </div>
            </div>
          </div>

          {/* Desktop share */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-gray-400 mr-1">Share:</span>
            {socialShares.map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-8 h-8 ${s.color} text-white rounded-full flex items-center justify-center hover:opacity-90 transition-opacity`}
              >
                <s.icon className="text-xs" />
              </a>
            ))}
          </div>
        </div>

        {/* Featured image */}
        <div className="mb-8 sm:mb-10 rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={post.image}
            alt={post.title}
            width={1200}
            height={500}
            className="w-full h-56 sm:h-80 md:h-[420px] object-cover"
          />
        </div>

        {/* Content */}
        <div className="prose prose-sm sm:prose-base prose-green max-w-none mb-10 prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-[#197B33] prose-img:rounded-xl">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-gray-100">
          <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
            <FaTag />
            Tags:
          </span>
          {post.tags.map((tag, i) => (
            <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-green-100 hover:text-[#197B33] transition-colors cursor-pointer">
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
              className="rounded-full border-3 border-white shadow-md flex-shrink-0"
            />
            <div>
              <p className="text-xs font-bold text-[#197B33] uppercase tracking-wide mb-1">About the Author</p>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{post.author.name}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{post.author.bio}</p>
            </div>
          </div>
        </div>

        {/* Related articles */}
        {relatedPosts.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Related Articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedPosts.map(related => (
                <Link
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className="group flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all hover:border-green-200"
                >
                  <div className="w-16 h-16 relative rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={related.image}
                      alt={related.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#197B33] transition-colors line-clamp-2 mb-1">
                      {related.title}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {new Date(related.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
            href="/"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 bg-[#197B33] text-white font-semibold rounded-full hover:bg-[#156529] transition-colors text-sm sm:text-base shadow-lg shadow-green-200"
          >
            Explore More Articles
            <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </article>
    </div>
  );
}