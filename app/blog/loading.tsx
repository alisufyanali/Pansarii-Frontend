// app/blog/loading.tsx
export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-white animate-pulse">

      {/* Banner */}
      <div className="bg-green-700 py-10 sm:py-12">
        <div className="max-w-3xl mx-auto px-[4%] text-center space-y-3">
          <div className="h-8 w-32 bg-green-600 rounded mx-auto" />
          <div className="h-5 w-64 bg-green-600 rounded mx-auto" />
          <div className="h-10 w-full max-w-md bg-green-600 rounded-lg mx-auto" />
        </div>
      </div>

      {/* Category tabs */}
      <div className="border-b border-gray-200 py-3 px-[4%]">
        <div className="flex gap-2 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 w-24 bg-gray-200 rounded-full flex-shrink-0" />
          ))}
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-[4%] py-8 space-y-10">

        {/* Featured section */}
        <div>
          <div className="h-6 w-40 bg-gray-200 rounded mb-5" />
          <div className="grid lg:grid-cols-[1fr_320px] gap-5">
            <div className="h-72 bg-gray-200 rounded-2xl" />
            <div className="flex flex-col gap-4">
              <div className="h-32 bg-gray-200 rounded-xl" />
              <div className="h-32 bg-gray-200 rounded-xl" />
            </div>
          </div>
        </div>

        {/* All articles grid */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="h-6 w-40 bg-gray-200 rounded" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="aspect-video bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-4/5" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
