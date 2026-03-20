// app/blog/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { blogPosts, BlogPost } from "../Desktop/data/blogposts";
import { 
  FaSearch, 
  FaCalendar, 
  FaUser, 
  FaClock,
  FaArrowRight,
  FaTag
} from "react-icons/fa";

// Skeletal Loading Components
function BlogPageSkeleton() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="relative bg-gradient-to-r from-gray-100 to-gray-200 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="h-10 sm:h-12 bg-gray-300 rounded w-48 sm:w-64 mx-auto"></div>
            <div className="h-5 sm:h-6 bg-gray-300 rounded w-72 sm:w-96 mx-auto"></div>
            <div className="max-w-2xl mx-auto">
              <div className="h-12 sm:h-14 bg-gray-300 rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Skeleton */}
      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-24 sm:w-32 h-9 sm:h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts Skeleton */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="h-8 sm:h-10 bg-gray-300 rounded w-40 sm:w-48 mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="h-48 sm:h-64 bg-gray-300"></div>
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex gap-4">
                  <div className="h-4 bg-gray-200 rounded w-20 sm:w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-16 sm:w-20"></div>
                </div>
                <div className="h-6 sm:h-8 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-16 sm:w-20"></div>
                      <div className="h-2 bg-gray-200 rounded w-12 sm:w-16"></div>
                    </div>
                  </div>
                  <div className="w-6 h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* All Posts Grid Skeleton */}
      <section className="bg-gray-50 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div className="h-8 sm:h-10 bg-gray-300 rounded w-40 sm:w-48"></div>
            <div className="h-5 sm:h-6 bg-gray-200 rounded w-24 sm:w-32"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="h-40 sm:h-48 bg-gray-300"></div>
                <div className="p-4 sm:p-5 space-y-4">
                  <div className="flex gap-3">
                    <div className="h-3 bg-gray-200 rounded w-16 sm:w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-12 sm:w-16"></div>
                  </div>
                  <div className="h-5 sm:h-6 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 rounded-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-20 sm:w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Tags Skeleton */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="h-7 sm:h-8 bg-gray-300 rounded w-40 sm:w-48 mb-6"></div>
        <div className="flex flex-wrap gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-20 sm:w-24 h-9 sm:h-10 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </section>

      {/* Newsletter CTA Skeleton */}
      <section className="bg-gradient-to-r from-gray-600 to-gray-700 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="h-8 sm:h-10 bg-gray-400 rounded w-72 sm:w-96 mx-auto"></div>
          <div className="h-5 sm:h-6 bg-gray-400 rounded w-64 sm:w-[500px] mx-auto"></div>
          <div className="max-w-md mx-auto flex gap-3">
            <div className="flex-1 h-11 sm:h-12 bg-gray-400 rounded-lg"></div>
            <div className="w-24 sm:w-32 h-11 sm:h-12 bg-gray-400 rounded-lg"></div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Categories from the blog posts
const getCategories = () => {
  const categoriesMap = new Map<string, number>();
  
  blogPosts.forEach(post => {
    const count = categoriesMap.get(post.category) || 0;
    categoriesMap.set(post.category, count + 1);
  });
  
  const allPostsCount = blogPosts.length;
  const categories = Array.from(categoriesMap.entries()).map(([name, count]) => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    count
  }));
  
  return [
    { id: "all", name: "All Posts", count: allPostsCount },
    ...categories
  ];
};

// Popular tags from all posts
const getPopularTags = () => {
  const tagCount = new Map<string, number>();
  
  blogPosts.forEach(post => {
    post.tags.forEach(tag => {
      const count = tagCount.get(tag) || 0;
      tagCount.set(tag, count + 1);
    });
  });
  
  // Sort by frequency and get top 8
  return Array.from(tagCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tag]) => tag);
};

export default function BlogPage() {
  const categories = getCategories();
  const popularTags = getPopularTags();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading - exact same as original
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Filter posts based on category and search - exact same logic as original
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "all" || 
      post.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory;
    
    const matchesSearch = searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = blogPosts.filter(post => post.id <= 2); // First 2 posts as featured

  // Show skeleton loading
  if (isLoading) {
    return <BlogPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-50 to-emerald-50 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="text-[#197B33]">Blog</span>
            </h1>
            <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8">
              Discover natural wellness tips, herbal remedies, and healthy living advice
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#197B33] focus:border-transparent outline-none transition-all text-sm sm:text-base"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-gray-200 sticky top-0 bg-white z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-3 sm:py-4 no-scrollbar">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-medium whitespace-nowrap transition-all text-sm sm:text-base flex-shrink-0 ${
                  selectedCategory === category.id
                    ? "bg-[#197B33] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts - only shown when no filter/search active, exact same condition as original */}
      {selectedCategory === "all" && searchQuery === "" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Featured Articles</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {featuredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-48 sm:h-64 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[#197B33] text-white text-sm font-medium rounded-full">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <FaCalendar />
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaClock />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#197B33] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                        loading="lazy"
                      />
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900">{post.author.name}</p>
                        <p className="text-xs text-gray-500">{post.author.bio.split('.')[0]}.</p>
                      </div>
                    </div>
                    <FaArrowRight className="text-[#197B33] group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All Posts Grid */}
      <section className="bg-gray-50 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900">
              {selectedCategory === "all" ? "All Articles" : 
               categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-sm sm:text-base text-gray-600">{filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found</p>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-44 sm:h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 sm:px-3 py-1 bg-white/90 backdrop-blur-sm text-[#197B33] text-xs font-medium rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <FaCalendar />
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaClock />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-[#197B33] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
                        loading="lazy"
                      />
                      <span className="text-xs font-medium text-gray-900">
                        {post.author.name}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-5xl mb-4">🔍</div>
              <p className="text-gray-500 text-lg mb-4">No articles found.</p>
              {searchQuery && (
                <p className="text-gray-600 mb-6">
                  Try a different search or clear the search box to see all articles.
                </p>
              )}
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="px-6 py-3 bg-[#197B33] text-white rounded-lg hover:bg-[#156529] transition-colors font-medium"
              >
                View All Articles
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Popular Tags */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Popular Tags</h2>
        <div className="flex flex-wrap gap-3">
          {popularTags.map((tag, index) => (
            <Link
              key={index}
              href="#"
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-[#197B33] hover:text-white transition-colors inline-flex items-center gap-2 text-sm"
            >
              <FaTag className="w-3 h-3" />
              {tag}
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}