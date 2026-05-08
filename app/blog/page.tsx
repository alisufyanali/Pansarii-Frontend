"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "../Desktop/data/blogposts";
import { FaSearch, FaCalendar, FaClock, FaArrowRight, FaTag, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PageBanner from "../components/PageBanner";

// ── Constants ─────────────────────────────────────────────────────────────────
const POSTS_PER_PAGE = 9;

// ── Derived data ──────────────────────────────────────────────────────────────
const categories = (() => {
  const map = new Map<string, number>();
  blogPosts.forEach(p => map.set(p.category, (map.get(p.category) ?? 0) + 1));
  return [
    { id: 'all', name: 'All Posts', count: blogPosts.length },
    ...Array.from(map.entries()).map(([name, count]) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      count,
    })),
  ];
})();

const popularTags = (() => {
  const map = new Map<string, number>();
  blogPosts.forEach(p => p.tags.forEach(t => map.set(t, (map.get(t) ?? 0) + 1)));
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag);
})();

// Featured = first 3 posts (1 hero + 2 side)
const featuredPosts = blogPosts.slice(0, 3);

// ── Sub-components ────────────────────────────────────────────────────────────

/** Inline skeleton — no separate component needed */
function Skeleton({ className }: { className: string }) {
  return <div className={`bg-gray-200 rounded animate-pulse ${className}`} />;
}

/** Standard blog card used in the grid */
function BlogCard({ post }: { post: typeof blogPosts[0] }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-green-200 transition-all duration-300 h-full"
    >
      <div className="relative w-full aspect-video overflow-hidden flex-shrink-0">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 text-[11px] font-semibold bg-green-700 text-white px-2.5 py-1 rounded-full">
          {post.category}
        </span>
      </div>
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-2">
          <FaCalendar className="w-2.5 h-2.5 flex-shrink-0" />
          <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          <span>·</span>
          <FaClock className="w-2.5 h-2.5 flex-shrink-0" />
          <span>{post.readTime}</span>
        </div>
        <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-green-700 transition-colors flex-1">
          {post.title}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
          {post.excerpt}
        </p>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 group-hover:text-green-600 transition-colors mt-auto">
          Read More <FaArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  );
}

/** Pagination bar */
function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) {
  if (total <= 1) return null;
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition"
      >
        <FaChevronLeft className="w-3 h-3 text-gray-600" />
      </button>
      {pages.map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium border transition ${
            p === current
              ? 'bg-green-700 text-white border-green-700'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition"
      >
        <FaChevronRight className="w-3 h-3 text-gray-600" />
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery,    setSearchQuery]    = useState('');
  const [currentPage,    setCurrentPage]    = useState(1);
  const [isLoading,      setIsLoading]      = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  // Reset page when filter changes
  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
    setCurrentPage(1);
  };
  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  const isFiltered = activeCategory !== 'all' || searchQuery !== '';

  const filteredPosts = blogPosts.filter(post => {
    const matchCat    = activeCategory === 'all' || post.category.toLowerCase().replace(/\s+/g, '-') === activeCategory;
    const matchSearch = !searchQuery || post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalPages    = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const pagedPosts    = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  // ── Skeleton ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white animate-pulse">
        <div className="bg-green-700 py-10 sm:py-12">
          <div className="max-w-3xl mx-auto px-[4%] text-center space-y-3">
            <Skeleton className="h-8 w-32 mx-auto" />
            <Skeleton className="h-5 w-64 mx-auto" />
            <Skeleton className="h-10 w-full max-w-md mx-auto rounded-lg" />
          </div>
        </div>
        <div className="border-b border-gray-200 py-3 px-[4%]">
          <div className="flex gap-2 overflow-hidden">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 w-24 rounded-full flex-shrink-0" />)}
          </div>
        </div>
        <div className="max-w-[1920px] mx-auto px-[4%] py-8">
          <Skeleton className="h-6 w-40 mb-5" />
          <div className="grid lg:grid-cols-[1fr_320px] gap-5 mb-10">
            <Skeleton className="h-72 rounded-xl" />
            <div className="flex flex-col gap-4">
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
            </div>
          </div>
          <Skeleton className="h-6 w-40 mb-5" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">

      {/* Banner with search */}
      <PageBanner
        icon={<FaSearch className="w-7 h-7" />}
        title="Wellness Blog"
        description="Natural health tips, herbal remedies, and Ayurvedic wisdom"
      >
        <div className="relative max-w-md mx-auto">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </PageBanner>

      {/* Category tabs — sticky */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-[4%]">
          <div className="flex gap-2 overflow-x-auto py-3 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all ${
                  activeCategory === cat.id
                    ? 'bg-green-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.name} <span className="opacity-70">({cat.count})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-[4%] py-8 space-y-10">

        {/* ── Featured Articles ─────────────────────────────────────────────── */}
        {/* Always visible — when filtered, show filtered featured posts */}
        {(() => {
          const featured = isFiltered
            ? filteredPosts.slice(0, 3)   // top 3 from filtered results
            : featuredPosts;              // default top 3

          if (featured.length === 0) return null;

          const [hero, ...side] = featured;

          return (
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {isFiltered ? 'Top Results' : 'Featured Articles'}
              </h2>

              {/* Desktop: 1 large hero + up to 2 side cards */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px] gap-5">

                {/* Hero card */}
                <Link
                  href={`/blog/${hero.slug}`}
                  className="group relative rounded-2xl overflow-hidden bg-gray-900 min-h-[280px] lg:min-h-[360px] flex flex-col justify-end"
                >
                  <Image
                    src={hero.image}
                    alt={hero.title}
                    fill
                    className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 65vw"
                    priority
                  />
                  <div className="relative z-10 p-5 sm:p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <span className="inline-block text-[11px] font-semibold bg-green-600 text-white px-2.5 py-1 rounded-full mb-2">
                      {hero.category}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white leading-snug mb-2 group-hover:text-green-300 transition-colors line-clamp-2">
                      {hero.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-white/70">
                      <span className="flex items-center gap-1"><FaCalendar className="w-2.5 h-2.5" />{new Date(hero.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="flex items-center gap-1"><FaClock className="w-2.5 h-2.5" />{hero.readTime}</span>
                    </div>
                  </div>
                </Link>

                {/* Side cards */}
                {side.length > 0 && (
                  <div className="flex flex-col gap-4">
                    {side.slice(0, 2).map(post => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="group flex gap-3 bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-green-200 transition-all p-3"
                      >
                        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="96px"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-semibold text-green-700 uppercase tracking-wide">{post.category}</span>
                            <h4 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 mt-0.5 group-hover:text-green-700 transition-colors">
                              {post.title}
                            </h4>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
                            <FaClock className="w-2.5 h-2.5 flex-shrink-0" />
                            <span>{post.readTime}</span>
                            <span>·</span>
                            <span>{post.author.name}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </section>
          );
        })()}

        {/* ── All Articles grid ─────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              {isFiltered
                ? categories.find(c => c.id === activeCategory)?.name ?? 'Results'
                : 'All Articles'}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
            </span>
          </div>

          {pagedPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {pagedPosts.map(post => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
              <Pagination
                current={currentPage}
                total={totalPages}
                onChange={p => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              />
            </>
          ) : (
            <div className="text-center py-16">
              <FaSearch className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium mb-4">No articles found.</p>
              <button
                onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                className="px-5 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 transition"
              >
                View All Articles
              </button>
            </div>
          )}
        </section>

        {/* ── Popular Tags ──────────────────────────────────────────────────── */}
        <section className="border-t border-gray-100 pt-8">
          <h2 className="text-base font-bold text-gray-900 mb-3">Popular Tags</h2>
          <div className="flex flex-wrap gap-2">
            {popularTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleSearch(tag)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-green-700 hover:text-white transition-colors"
              >
                <FaTag className="w-2.5 h-2.5" />
                {tag}
              </button>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
