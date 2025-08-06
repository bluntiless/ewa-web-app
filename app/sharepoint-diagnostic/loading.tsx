export default function SharePointDiagnosticLoading() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-800 rounded w-64 mb-6"></div>

          <div className="bg-neutral-900 rounded-2xl shadow-lg p-6 mb-6">
            <div className="h-6 bg-neutral-800 rounded w-48 mb-4"></div>
            <div className="h-4 bg-neutral-800 rounded w-full mb-2"></div>
            <div className="h-4 bg-neutral-800 rounded w-3/4 mb-4"></div>
            <div className="h-12 bg-neutral-800 rounded w-40"></div>
          </div>

          <div className="bg-neutral-900 rounded-2xl shadow-lg p-6">
            <div className="h-6 bg-neutral-800 rounded w-48 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="border border-neutral-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-5 bg-neutral-800 rounded w-40"></div>
                    <div className="h-6 w-6 bg-neutral-800 rounded"></div>
                  </div>
                  <div className="h-4 bg-neutral-800 rounded w-3/4 mb-2"></div>
                  <div className="h-16 bg-neutral-800 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
