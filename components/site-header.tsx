"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

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
    <header className="w-full bg-white shadow-sm py-4 px-6 md:px-8 lg:px-12">
      <div className="flex justify-between items-center">
        <Link href="/">
          <Image
            src="/ewa_logo.png"
            alt="EWA Tracker Logo"
            width={120}
            height={40}
            className="object-contain"
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
          className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-700 hover:bg-gray-100 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile navigation menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden mt-4 pb-2 border-t border-gray-100 pt-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={
                pathname === link.href
                  ? "text-blue-700 font-medium py-2 px-3 rounded-md bg-blue-50 transition-colors"
                  : "text-gray-700 hover:text-blue-700 font-medium py-2 px-3 rounded-md hover:bg-gray-50 transition-colors"
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
