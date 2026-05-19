// app/wishlist/loading.tsx
export default function WishlistLoading() {
  return (
    <div className="min-h-screen bg-gray-50 pb-28 animate-pulse">

      {/* Header */}
      <div className="bg-white px-4 pt-5 pb-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full" />
          <div>
            <div className="h-4 w-28 bg-gray-200 rounded mb-1" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
      </div>

      {/* Product grid */}
      <div className="px-4 pt-4 grid grid-cols-2 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div className="aspect-square bg-gray-200" />
            <div className="p-3 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-8 bg-gray-200 rounded-xl mt-2" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
