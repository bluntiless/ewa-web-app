"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
]

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="relative z-50 w-full bg-white shadow-sm py-4 px-6 md:px-8 lg:px-12">
      <div className="flex justify-between items-center">
        <Link href="/">
          <Image
            src="/ewa_logo.png"
            alt="EWA Tracker Logo"
            width={120}
            height={40}
            className="object-contain w-[120px] h-auto"
            priority
          />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href
                  ? "text-blue-700 font-medium transition-colors"
                  : "text-gray-700 hover:text-blue-700 font-medium transition-colors"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Hamburger button - mobile only */}
        <button
          type="button"
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-md text-gray-700 hover:text-blue-700 hover:bg-gray-100 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile navigation menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden mt-4 pb-2 border-t border-gray-200 pt-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={
                pathname === link.href
                  ? "text-blue-700 font-semibold py-3 px-4 rounded-md bg-blue-50 transition-colors text-lg"
                  : "text-gray-700 hover:text-blue-700 font-medium py-3 px-4 rounded-md hover:bg-gray-50 transition-colors text-lg"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
