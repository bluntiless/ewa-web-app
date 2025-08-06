'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, Folder, Users, FileText } from 'lucide-react'
import { cn } from "@/lib/utils"

export default function BottomNavigation() {
  const pathname = usePathname()

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Units", href: "/units", icon: BookOpen },
    { name: "Portfolio", href: "/portfolio", icon: Folder },
    { name: "Assessments", href: "/assessments", icon: FileText },
    { name: "Teams", href: "/teams", icon: Users },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 shadow-lg z-50">
      <div className="max-w-full mx-auto h-16 flex items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link key={item.name} href={item.href} passHref>
              <div
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-md transition-colors duration-200",
                  isActive ? "text-blue-500" : "text-neutral-400 hover:text-neutral-200"
                )}
              >
                <item.icon className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium">{item.name}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
