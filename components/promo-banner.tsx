import Link from "next/link"
import { Tag } from "lucide-react"
import { promotion, isPromotionActive, maxSavings, formatCurrency } from "@/lib/pricing"

// Slim site-wide announcement bar for the limited-time price reduction.
// Renders nothing when the promotion is inactive or has ended.
export default function PromoBanner() {
  if (!isPromotionActive()) return null

  return (
    <div className="bg-blue-900 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-center text-sm sm:flex-row">
        <span className="inline-flex items-center gap-1.5 font-semibold text-amber-300">
          <Tag className="h-4 w-4" aria-hidden="true" />
          {promotion.label}
        </span>
        <span className="text-blue-50">
          Save up to <strong className="font-semibold text-white">{formatCurrency(maxSavings)}</strong> on your EWA
          assessment &mdash; ends {promotion.endDateLabel}.
        </span>
        <Link
          href="/course-booking"
          className="font-semibold text-amber-300 underline underline-offset-2 hover:text-amber-200"
        >
          Book now
        </Link>
      </div>
    </div>
  )
}
