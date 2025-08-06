"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, FolderOpen, User, Users, ClipboardCheck } from "lucide-react"

const navigation = [
  { name: "Qualifications", href: "/", icon: Home },
  { name: "Portfolio", href: "/portfolio", icon: FolderOpen },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Teams", href: "/teams", icon: Users },
  { name: "Assessor Review", href: "/assessor-review", icon: ClipboardCheck },
]

export default function BottomNavigation() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 safe-area-inset-bottom">
      <div className="flex justify-around items-center py-2 px-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 text-xs font-medium transition-colors ${
                isActive ? "text-blue-500" : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? "text-blue-500" : "text-neutral-400"}`} />
              <span className="truncate">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
