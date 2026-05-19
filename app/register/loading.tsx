// app/register/loading.tsx
export default function RegisterLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white p-4 animate-pulse">
      <div className="w-full max-w-md">

        {/* Header text */}
        <div className="text-center mb-8 space-y-2">
          <div className="h-8 w-44 bg-gray-200 rounded mx-auto" />
          <div className="h-4 w-60 bg-gray-200 rounded mx-auto" />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-5">
          {/* Name field */}
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded-lg" />
          </div>
          {/* Email field */}
          <div className="space-y-2">
            <div className="h-4 w-28 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded-lg" />
          </div>
          {/* Password field */}
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded-lg" />
          </div>
          {/* Confirm password */}
          <div className="space-y-2">
            <div className="h-4 w-36 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded-lg" />
          </div>
          {/* Submit button */}
          <div className="h-12 bg-gray-200 rounded-lg" />
          {/* Divider */}
          <div className="h-px bg-gray-200" />
          {/* Sign in link */}
          <div className="h-4 w-44 bg-gray-200 rounded mx-auto" />
        </div>

      </div>
    </div>
  );
}
