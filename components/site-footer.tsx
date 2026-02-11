export default function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 text-center">
      <div className="max-w-6xl mx-auto px-4">
        <p suppressHydrationWarning>
          &copy; {new Date().getFullYear()} EWA Tracker Limited. All rights reserved.
        </p>
        <p className="mt-2 text-sm">Registered in England and Wales. Company No. 16413190.</p>
        <div className="flex justify-center gap-4 mt-4">
          <a
            href="https://linkedin.com/company/ewatracker"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://twitter.com/ewatracker"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Twitter
          </a>
          <a
            href="https://github.com/ewatracker"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
