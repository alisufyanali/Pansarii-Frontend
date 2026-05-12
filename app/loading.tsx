// app/loading.tsx — global fallback shown during any top-level navigation
export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      {/* Navbar placeholder */}
      <div className="h-16 bg-gray-100 border-b border-gray-200" />

      {/* Hero banner */}
      <div className="w-full h-[55vh] min-h-[320px] max-h-[600px] bg-gray-200" />

      {/* Section: heading + cards */}
      <div className="mx-[4%] py-10 max-w-[1920px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="h-7 w-48 bg-gray-200 rounded-lg" />
          <div className="h-9 w-32 bg-gray-200 rounded-full" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl overflow-hidden">
              <div className="aspect-square bg-gray-200" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-9 bg-gray-200 rounded-full mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Second section */}
      <div className="mx-[4%] pb-10 max-w-[1920px] mx-auto">
        <div className="h-7 w-40 bg-gray-200 rounded-lg mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl overflow-hidden">
              <div className="aspect-square bg-gray-200" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-9 bg-gray-200 rounded-full mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
