"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, Folder, Users, ClipboardCheck } from 'lucide-react'
import { cn } from "@/lib/utils"

export function BottomNavigation() {
  const pathname = usePathname()

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Units", href: "/units", icon: BookOpen },
    { name: "Portfolio", href: "/portfolio", icon: Folder },
    { name: "Assessments", href: "/assessments", icon: ClipboardCheck },
    { name: "Teams", href: "/teams", icon: Users },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex h-16 items-center justify-around px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href} className="flex flex-col items-center text-center group">
              <item.icon
                className={cn(
                  "h-6 w-6 transition-colors",
                  isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400",
                )}
              />
              <span
                className={cn(
                  "text-xs mt-1 font-medium transition-colors",
                  isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400",
                )}
              >
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
