import type { Metadata } from "next"
import CandidateCheckClientWrapper from "./client-wrapper"

export const metadata: Metadata = {
  title: "Candidate Background Check & Skills Scan",
  description:
    "Complete your candidate background check and skills scan with EWA Tracker Ltd, an EAL approved centre for the Level 3 Electrotechnical Experienced Worker Qualification.",
  keywords: ["candidate background check", "skills scan", "electrician assessment", "EWA eligibility", "electrical experience", "EAL approved centre"],
  alternates: {
    canonical: "https://ewatracker.co.uk/candidate-check",
  },
  openGraph: {
    title: "Candidate Background Check & Skills Scan - EWA Tracker Ltd",
    description:
      "Complete your candidate background check and skills scan to start your EAL approved electrotechnical qualification journey.",
    url: "https://ewatracker.co.uk/candidate-check",
  },
}

export default function CandidateCheckPage() {
  return <CandidateCheckClientWrapper />
}
