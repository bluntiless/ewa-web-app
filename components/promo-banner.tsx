import Link from "next/link"
import { Tag, ArrowRight } from "lucide-react"
import { pricing, promotion, isPromotionActive, maxSavings, formatCurrency } from "@/lib/pricing"

// Site-wide announcement bar for the limited-time price reduction.
// Renders nothing when the promotion is inactive or has ended.
export default function PromoBanner() {
  if (!isPromotionActive()) return null

  const standard = pricing.standardFull
  const gold = pricing.goldFull

  return (
    <div className="bg-amber-400 text-blue-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:py-3.5">
        <div className="flex flex-col items-center gap-2 text-center lg:flex-row lg:gap-5 lg:text-left">
          <span className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-blue-900 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-amber-300">
            <Tag className="h-4 w-4" aria-hidden="true" />
            {promotion.label} &middot; ends {promotion.endDateLabel}
          </span>
          <p className="text-lg font-extrabold leading-tight sm:text-xl text-balance">
            Save up to {formatCurrency(maxSavings)} on your EWA assessment
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-5">
          <dl className="flex items-center gap-5 text-sm">
            <div className="flex flex-col items-center sm:items-start">
              <dt className="text-xs font-semibold uppercase tracking-wide text-blue-900/70">Standard</dt>
              <dd className="flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold">{formatCurrency(standard.total)}</span>
                {standard.originalTotal && (
                  <s className="text-xs text-blue-900/60">{formatCurrency(standard.originalTotal)}</s>
                )}
              </dd>
            </div>
            <div className="h-8 w-px bg-blue-900/20" aria-hidden="true" />
            <div className="flex flex-col items-center sm:items-start">
              <dt className="text-xs font-semibold uppercase tracking-wide text-blue-900/70">Gold</dt>
              <dd className="flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold">{formatCurrency(gold.total)}</span>
                {gold.originalTotal && (
                  <s className="text-xs text-blue-900/60">{formatCurrency(gold.originalTotal)}</s>
                )}
              </dd>
            </div>
          </dl>

          <Link
            href="/course-booking"
            className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-blue-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-400"
          >
            Book now
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  )
}
