export default function ResetPasswordSuccessLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white p-4 animate-pulse">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto" />
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gray-200 rounded mx-auto" />
            <div className="h-4 w-52 bg-gray-200 rounded mx-auto" />
          </div>
          <div className="h-12 bg-gray-200 rounded-lg" />
          <div className="h-4 w-44 bg-gray-200 rounded mx-auto" />
        </div>
      </div>
    </div>
  );
}
