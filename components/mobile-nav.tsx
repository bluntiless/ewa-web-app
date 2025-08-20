"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface MobileNavProps {
  className?: string
}

export function MobileNav({ className }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const closeSheet = () => setIsOpen(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={className}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[250px] sm:w-[300px]">
        <nav className="flex flex-col gap-4 pt-8">
          <Link href="/" className="text-lg font-medium hover:text-blue-700 transition-colors" onClick={closeSheet}>
            Home
          </Link>
          <Link
            href="/about"
            className="text-lg font-medium hover:text-blue-700 transition-colors"
            onClick={closeSheet}
          >
            About Us
          </Link>
          <Link
            href="/services"
            className="text-lg font-medium hover:text-blue-700 transition-colors"
            onClick={closeSheet}
          >
            Services
          </Link>
          <Link
            href="/contact"
            className="text-lg font-medium hover:text-blue-700 transition-colors"
            onClick={closeSheet}
          >
            Contact
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
