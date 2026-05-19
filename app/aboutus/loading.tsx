// app/aboutus/loading.tsx
export default function AboutUsLoading() {
  return (
    <div className="min-h-screen bg-white animate-pulse">

      {/* Page banner */}
      <div className="bg-green-700 py-10 sm:py-14">
        <div className="max-w-3xl mx-auto px-[4%] text-center space-y-3">
          <div className="w-14 h-14 bg-green-600 rounded-full mx-auto" />
          <div className="h-8 w-52 bg-green-600 rounded mx-auto" />
          <div className="h-4 w-80 bg-green-600 rounded mx-auto" />
        </div>
      </div>

      {/* Mission section */}
      <section className="max-w-4xl mx-auto px-[4%] py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          <div className="space-y-3">
            <div className="h-6 w-48 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-4/5" />
          </div>
          <div className="h-64 bg-gray-200 rounded-2xl" />
        </div>
      </section>

      {/* Quality section */}
      <section className="bg-green-50 py-8">
        <div className="max-w-4xl mx-auto px-[4%]">
          <div className="text-center mb-6 space-y-2">
            <div className="h-6 w-56 bg-gray-200 rounded mx-auto" />
            <div className="h-4 w-80 bg-gray-200 rounded mx-auto" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 text-center space-y-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto" />
                <div className="h-3 w-20 bg-gray-200 rounded mx-auto" />
                <div className="h-3 w-24 bg-gray-200 rounded mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision/Values cards */}
      <section className="max-w-4xl mx-auto px-[4%] py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl p-6 space-y-3">
              <div className="h-6 w-28 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/5" />
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
