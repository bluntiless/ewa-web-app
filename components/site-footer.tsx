import Image from "next/image"

export default function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 text-center">
      <div className="max-w-6xl mx-auto px-4">
        {/* EAL Recognised Logo */}
        <div className="flex justify-center mb-6">
          <a 
            href="https://eal.org.uk" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-90 transition-opacity"
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/EAL_Recognised_Logo_Col_300dpi-OQe79dzdNJ1lbYzo5bBHlOjjdRjIhQ.png"
              alt="EAL Recognised Centre"
              width={120}
              height={80}
              className="h-16 w-auto"
            />
          </a>
        </div>
        
        <p suppressHydrationWarning>
          &copy; {new Date().getFullYear()} EWA Tracker Ltd. All rights reserved.
        </p>
        <p className="mt-2 text-sm">Registered in England and Wales. Company No. 16413190.</p>
        <div className="flex justify-center gap-4 mt-4">
          <a
            href="https://www.linkedin.com/in/wayne-wright-99649075"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://www.instagram.com/ewa_tracker_ltd/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Instagram
          </a>
        </div>
        <div className="mt-6">
          <a
            href="https://calendly.com/ewatracker-info/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Request an EWA Call
          </a>
        </div>
      </div>
    </footer>
  )
}
