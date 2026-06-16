"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { getBlogs, type ApiBlog, type ApiBlogCategory } from "@/lib/blog";
import { blogPosts } from "@/data/blogposts";
import { FaSearch, FaCalendar, FaArrowRight, FaTag, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PageBanner from "@/components/PageBanner";

const POSTS_PER_PAGE = 9;
const FALLBACK_IMG = "/images/product.png";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return dateStr; }
}

// Normalise static post to share shape with API post
interface NormPost {
  id:        number | string;
  title:     string;
  slug:      string;
  excerpt:   string;
  thumbnail: string | null;
  category:  { id: number; name: string; slug: string };
  tags:      string[];
  date:      string;
}

function normApi(p: ApiBlog): NormPost {
  return {
    id:        p.id,
    title:     p.title,
    slug:      p.slug,
    excerpt:   p.excerpt,
    thumbnail: p.thumbnail,
    category:  p.category,
    tags:      p.tags.map(t => t.name),
    date:      p.created_at,
  };
}

function normStatic(p: typeof blogPosts[0]): NormPost {
  return {
    id:        p.id,
    title:     p.title,
    slug:      p.slug,
    excerpt:   p.excerpt,
    thumbnail: p.image,
    category:  { id: 0, name: p.category, slug: p.category.toLowerCase().replace(/\s+/g, '-') },
    tags:      p.tags,
    date:      p.date,
  };
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function BlogSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
          <div className="aspect-video bg-gray-200" />
          <div className="p-4 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Blog card ──────────────────────────────────────────────────────────────────

function BlogCard({ post }: { post: NormPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-green-200 transition-all duration-300 h-full"
    >
      <div className="relative w-full aspect-video overflow-hidden flex-shrink-0">
        <Image
          src={post.thumbnail || FALLBACK_IMG}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
        />
        <span className="absolute top-3 left-3 text-[11px] font-semibold bg-green-700 text-white px-2.5 py-1 rounded-full">
          {post.category.name}
        </span>
      </div>
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-2">
          <FaCalendar className="w-2.5 h-2.5 flex-shrink-0" />
          <span>{fmt(post.date)}</span>
        </div>
        <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-green-700 transition-colors flex-1">
          {post.title}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">{post.excerpt}</p>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 group-hover:text-green-600 transition-colors mt-auto">
          Read More <FaArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────

function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) {
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button onClick={() => onChange(current - 1)} disabled={current === 1}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition">
        <FaChevronLeft className="w-3 h-3 text-gray-600" />
      </button>
      {Array.from({ length: total }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => onChange(p)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium border transition ${
            p === current ? 'bg-green-700 text-white border-green-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}>
          {p}
        </button>
      ))}
      <button onClick={() => onChange(current + 1)} disabled={current === total}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition">
        <FaChevronRight className="w-3 h-3 text-gray-600" />
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function BlogPage() {
  const [posts,          setPosts]          = useState<NormPost[]>([]);
  const [categories,     setCategories]     = useState<{ id: string | number; name: string; count: number }[]>([]);
  const [popularTags,    setPopularTags]    = useState<string[]>([]);
  const [isLoading,      setIsLoading]      = useState(true);
  const [activeCategory, setActiveCategory] = useState<number | 'all'>('all');
  const [searchQuery,    setSearchQuery]    = useState('');
  const [currentPage,    setCurrentPage]    = useState(1);
  const [totalPages,     setTotalPages]     = useState(1);
  const [totalCount,     setTotalCount]     = useState(0);

  // ── Fetch ────────────────────────────────────────────────────────────────────
  const fetchPosts = useCallback(async (page: number, catId: number | 'all', search: string) => {
    setIsLoading(true);
    try {
      const res = await getBlogs({
        page,
        per_page:    POSTS_PER_PAGE,
        ...(catId !== 'all' ? { category_id: catId } : {}),
        ...(search ? { search } : {}),
      });
      const norm = res.data.map(normApi);
      setPosts(norm);
      setTotalPages(res.meta.last_page);
      setTotalCount(res.meta.total);

      // Build category list from API on first load
      if (page === 1 && catId === 'all' && !search && categories.length === 0) {
        const catMap = new Map<number, { name: string; count: number }>();
        res.data.forEach(p => {
          const c = p.category;
          catMap.set(c.id, { name: c.name, count: (catMap.get(c.id)?.count ?? 0) + 1 });
        });
        setCategories([
          { id: 'all', name: 'All Posts', count: res.meta.total },
          ...Array.from(catMap.entries()).map(([id, { name, count }]) => ({ id, name, count })),
        ]);
        // Popular tags
        const tagMap = new Map<string, number>();
        res.data.forEach(p => p.tags.forEach(t => tagMap.set(t.name, (tagMap.get(t.name) ?? 0) + 1)));
        setPopularTags(Array.from(tagMap.entries()).sort((a,b) => b[1]-a[1]).slice(0,10).map(([t]) => t));
      }
    } catch {
      // Fallback to static data
      const norm = blogPosts.map(normStatic);
      const filtered = norm.filter(p => {
        const matchCat  = catId === 'all' || p.category.id === catId;
        const matchSrch = !search || p.title.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSrch;
      });
      const start = (page - 1) * POSTS_PER_PAGE;
      setPosts(filtered.slice(start, start + POSTS_PER_PAGE));
      setTotalPages(Math.ceil(filtered.length / POSTS_PER_PAGE));
      setTotalCount(filtered.length);

      if (categories.length === 0) {
        const catMap = new Map<string, number>();
        blogPosts.forEach(p => catMap.set(p.category, (catMap.get(p.category) ?? 0) + 1));
        setCategories([
          { id: 'all', name: 'All Posts', count: blogPosts.length },
          ...Array.from(catMap.entries()).map(([name, count]) => ({ id: name.toLowerCase().replace(/\s+/g, '-'), name, count })),
        ]);
        const tagMap = new Map<string, number>();
        blogPosts.forEach(p => p.tags.forEach(t => tagMap.set(t, (tagMap.get(t) ?? 0) + 1)));
        setPopularTags(Array.from(tagMap.entries()).sort((a,b) => b[1]-a[1]).slice(0,10).map(([t]) => t));
      }
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { fetchPosts(currentPage, activeCategory, searchQuery); }, [currentPage, activeCategory, searchQuery, fetchPosts]);

  const handleCategoryChange = (id: number | 'all') => { setActiveCategory(id); setCurrentPage(1); };
  const handleSearch         = (q: string)           => { setSearchQuery(q);    setCurrentPage(1); };
  const handleTagSearch      = (tag: string)          => { handleSearch(tag); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const [hero, ...sidePosts] = posts;

  return (
    <div className="min-h-screen bg-white">
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

      {/* Category tabs */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-[4%]">
          <div className="flex gap-2 overflow-x-auto py-3 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id as number | 'all')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all ${
                  activeCategory === cat.id ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.name} <span className="opacity-70">({cat.count})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-[4%] py-8 space-y-10">

        {isLoading ? (
          <BlogSkeleton />
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <FaSearch className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium mb-4">No articles found.</p>
            <button onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              className="px-5 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 transition">
              View All Articles
            </button>
          </div>
        ) : (
          <>
            {/* Featured hero + side */}
            {hero && (
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  {searchQuery || activeCategory !== 'all' ? 'Top Results' : 'Featured Articles'}
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px] gap-5">
                  <Link href={`/blog/${hero.slug}`}
                    className="group relative rounded-2xl overflow-hidden bg-gray-900 min-h-[280px] lg:min-h-[360px] flex flex-col justify-end">
                    <Image
                      src={hero.thumbnail || FALLBACK_IMG}
                      alt={hero.title}
                      fill
                      className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 1024px) 100vw, 65vw"
                      priority
                    />
                    <div className="relative z-10 p-5 sm:p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                      <span className="inline-block text-[11px] font-semibold bg-green-600 text-white px-2.5 py-1 rounded-full mb-2">
                        {hero.category.name}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-white leading-snug mb-2 group-hover:text-green-300 transition-colors line-clamp-2">
                        {hero.title}
                      </h3>
                      <span className="text-xs text-white/70 flex items-center gap-1">
                        <FaCalendar className="w-2.5 h-2.5" />{fmt(hero.date)}
                      </span>
                    </div>
                  </Link>

                  {sidePosts.length > 0 && (
                    <div className="flex flex-col gap-4">
                      {sidePosts.slice(0, 2).map(post => (
                        <Link key={post.id} href={`/blog/${post.slug}`}
                          className="group flex gap-3 bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-green-200 transition-all p-3">
                          <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                            <Image src={post.thumbnail || FALLBACK_IMG} alt={post.title} fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="96px" loading="lazy" />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <span className="text-[10px] font-semibold text-green-700 uppercase tracking-wide">{post.category.name}</span>
                              <h4 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 mt-0.5 group-hover:text-green-700 transition-colors">
                                {post.title}
                              </h4>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1">{fmt(post.date)}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* All articles grid */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  {searchQuery || activeCategory !== 'all' ? 'Results' : 'All Articles'}
                </h2>
                <span className="text-sm text-gray-500">{totalCount} article{totalCount !== 1 ? 's' : ''}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {posts.map(post => <BlogCard key={post.id} post={post} />)}
              </div>
              <Pagination
                current={currentPage}
                total={totalPages}
                onChange={p => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              />
            </section>
          </>
        )}

        {/* Popular Tags */}
        {popularTags.length > 0 && (
          <section className="border-t border-gray-100 pt-8">
            <h2 className="text-base font-bold text-gray-900 mb-3">Popular Tags</h2>
            <div className="flex flex-wrap gap-2">
              {popularTags.map(tag => (
                <button key={tag} onClick={() => handleTagSearch(tag)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-green-700 hover:text-white transition-colors">
                  <FaTag className="w-2.5 h-2.5" />{tag}
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
