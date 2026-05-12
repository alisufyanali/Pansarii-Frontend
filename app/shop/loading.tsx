// app/shop/loading.tsx — matches ShopContent layout: filter bar + product grid
function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
        <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
        <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto" />
        <div className="flex items-center justify-center gap-2 pt-1">
          <div className="h-3 w-10 bg-gray-200 rounded" />
          <div className="h-3 w-10 bg-gray-200 rounded" />
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-3 w-14 bg-gray-200 rounded" />
        </div>
        <div className="h-10 bg-gray-200 rounded-full mt-2" />
      </div>
    </div>
  );
}

export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-4 lg:px-6 2xl:px-10 py-4 sm:py-6">

        {/* Search + filter bar */}
        <div className="mb-4 sm:mb-6 animate-pulse">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search input */}
            <div className="h-10 bg-gray-200 rounded-lg flex-1" />
            {/* Sort dropdown */}
            <div className="h-10 w-40 bg-gray-200 rounded-lg" />
            {/* View toggle */}
            <div className="flex gap-2">
              <div className="h-10 w-10 bg-gray-200 rounded-lg" />
              <div className="h-10 w-10 bg-gray-200 rounded-lg" />
            </div>
          </div>

          {/* Category filter chips */}
          <div className="flex gap-2 mt-3 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-8 w-24 bg-gray-200 rounded-full flex-shrink-0" />
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-4" />

        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 2xl:gap-8">
          {[...Array(15)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-center gap-2 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-10 h-10 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
