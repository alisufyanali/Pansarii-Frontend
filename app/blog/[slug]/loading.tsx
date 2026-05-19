export default function BlogDetailLoading() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      {/* Sticky nav bar skeleton */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="h-5 w-28 bg-gray-200 rounded" />
          <div className="h-7 w-16 bg-gray-200 rounded-full sm:hidden" />
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Category badge */}
        <div className="w-28 h-7 bg-gray-200 rounded-full mb-5" />

        {/* Title */}
        <div className="h-9 bg-gray-300 rounded w-full mb-3" />
        <div className="h-9 bg-gray-300 rounded w-4/5 mb-7" />

        {/* Author row */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-3 bg-gray-200 rounded w-48" />
          </div>
          {/* Desktop share buttons */}
          <div className="hidden sm:flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-8 h-8 bg-gray-200 rounded-full" />
            ))}
          </div>
        </div>

        {/* Featured image */}
        <div className="w-full h-56 sm:h-80 md:h-[420px] bg-gray-300 rounded-2xl mb-8 sm:mb-10" />

        {/* Content paragraphs */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2 mb-4">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-11/12" />
            <div className="h-4 bg-gray-200 rounded w-4/5" />
          </div>
        ))}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-gray-100">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-7 w-20 bg-gray-200 rounded-lg" />
          ))}
        </div>

        {/* Author bio card */}
        <div className="bg-gray-100 rounded-2xl p-5 sm:p-7 mb-10">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 bg-gray-200 rounded" />
              <div className="h-5 w-40 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        </div>

        {/* Related articles */}
        <div className="mb-10">
          <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-4">
                <div className="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <div className="h-12 w-52 bg-gray-200 rounded-full" />
        </div>
      </article>
    </div>
  );
}
