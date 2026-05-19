// app/contact/loading.tsx
export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-white animate-pulse">

      {/* Page banner */}
      <div className="bg-green-700 py-10 sm:py-14">
        <div className="max-w-3xl mx-auto px-[4%] text-center space-y-3">
          <div className="w-14 h-14 bg-green-600 rounded-full mx-auto" />
          <div className="h-8 w-48 bg-green-600 rounded mx-auto" />
          <div className="h-4 w-72 bg-green-600 rounded mx-auto" />
        </div>
      </div>

      {/* Contact form + info */}
      <div className="max-w-5xl mx-auto px-[4%] py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">

          {/* Form */}
          <div className="space-y-5">
            <div className="h-6 w-40 bg-gray-200 rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="h-11 bg-gray-200 rounded-lg" />
                </div>
              ))}
              <div className="sm:col-span-2 space-y-2">
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-32 bg-gray-200 rounded-lg" />
              </div>
            </div>
            <div className="h-12 bg-gray-200 rounded-full w-40" />
          </div>

          {/* Info sidebar */}
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-5 space-y-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="h-4 w-28 bg-gray-200 rounded" />
                <div className="h-3 w-40 bg-gray-200 rounded" />
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}
