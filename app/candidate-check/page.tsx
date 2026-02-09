import type { Metadata } from "next"
import CandidateCheckClientWrapper from "./client-wrapper"

export const metadata: Metadata = {
  title: "Candidate Background Check & Skills Scan",
  description:
    "Complete your candidate background check and skills scan with EWA Tracker Limited to start your electrotechnical qualification journey.",
  keywords: ["candidate background check", "skills scan", "electrician assessment", "EWA eligibility", "electrical experience"],
  alternates: {
    canonical: "https://ewatracker.co.uk/candidate-check",
  },
  openGraph: {
    title: "Candidate Background Check & Skills Scan - EWA Tracker Limited",
    description:
      "Complete your candidate background check and skills scan to start your electrotechnical qualification journey.",
    url: "https://ewatracker.co.uk/candidate-check",
  },
}

export default function CandidateCheckPage() {
  return <CandidateCheckClientWrapper />
}
