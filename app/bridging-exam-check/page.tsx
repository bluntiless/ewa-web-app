"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MobileNav } from "@/components/mobile-nav"

// Qualifications that, if held as a single Level 3 qualification, mean the bridging exam is NOT required for NVQ 1605.
// These are generally full Level 3 Electrotechnical qualifications or equivalent.
const recognisedLevel3Direct = [
  "City & Guilds 2330 (Level 2 and Level 3)", // Implies full L3
  "City & Guilds 236 Parts 2", // Implies full L3
  "City & Guilds 2360 Parts 2", // Implies full L3
  "City & Guilds 2351 (All 8 units)", // Implies full L3
  "City & Guilds 2365-03 Level 3 Diploma in Electrical Installation (600/5499/2)",
  "City & Guilds 8202-30 Level 3 Advanced Technical Diploma (601/7307/5)",
  "EAL Diploma in Electrotechnical Services Level 3 (All 10 units) (500/3526/5)",
  "EAL Level 3 Diploma in Electrical Installation (QCF) (600/9331/6)",
  "EAL Level 3 Advanced Diploma in Electrical Installation (601/4563/8)",
  "City and Guilds 2360 Part 1 And Part 2 – Theory and Practical",
]

// Level 2 qualifications that can be selected
const level2Qualifications = [
  "City & Guilds 2330 Level 2 only",
  "City & Guilds 236 Parts 1",
  "City & Guilds 2360 Parts 1",
  "City & Guilds 2351 (Units 1–4 only)",
  "City & Guilds 2365-02 Level 2 (600/5498/0)",
  "EAL Diploma in Electrotechnical Services (Units 1–6)",
  "EAL Level 2 Diploma in Electrical Installation (QCF) (600/6724/X)",
  "EAL Level 2 Intermediate Diploma (601/4561/4)",
  "City and Guilds Level 2 Certificate in Electrotechnical Technology - Installation (Buildings and Structures) (2330) 100/3569/2",
]

// Level 3 qualifications that can be selected (including those that might require bridging if not combined with specific L2)
const level3Qualifications = [
  ...recognisedLevel3Direct, // Include these so they can be selected in the L3 dropdown
  "EAL Level 3 Award in BS 7671:2018 (2022/2024) 603/3298/0",
  "City and Guilds Level 3 Award in BS 76711:2018 2382-18 or 2382-22",
  "EAL Level 3 Award in Initial Verification and Certification of Electrical Installations 600/4337/4",
  "City and Guilds Level 3 Award in Initial Verification of Electrical Installations 2391-50",
  "City and Guilds Level 3 Certificate in Electrotechnical Technology - Installation (Buildings and Structures) (2330) 100/3602/7",
  "City and Guilds 2360 Part 1 and Part 2 - Theory",
]

// Combinations of Level 2 and Level 3 qualifications that, together, mean the bridging exam is NOT required.
const bridgingExemptCombinations = [
  {
    level2:
      "City and Guilds Level 2 Certificate in Electrotechnical Technology - Installation (Buildings and Structures) (2330) 100/3569/2",
    level3: "City and Guilds Level 3 Diploma in Electrical Installations (Buildings and Structures) (2365) 600/5499/2",
  },
  {
    level2:
      "City and Guilds Level 2 Certificate in Electrotechnical Technology - Installation (Buildings and Structures) (2330) 100/3569/2",
    level3:
      "City and Guilds Level 3 Certificate in Electrotechnical Technology - Installation (Buildings and Structures) (2330) 100/3602/7",
  },
]

// Sort and add "Other / Not Listed"
const sortedLevel2Qualifications = [...new Set(level2Qualifications)].sort()
sortedLevel2Qualifications.push("Other / Not Listed")

const sortedLevel3Qualifications = [...new Set(level3Qualifications)].sort()
sortedLevel3Qualifications.push("Other / Not Listed")

export default function BridgingExamCheckPage() {
  const [selectedLevel2, setSelectedLevel2] = useState("")
  const [selectedLevel3, setSelectedLevel3] = useState("")
  const [result, setResult] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLevel2 && !selectedLevel3) {
      setResult("Please select at least one qualification.")
      return
    }

    let isBridgingRequired = true
    let customMessage = ""

    // Handle "Other / Not Listed" first
    if (selectedLevel2 === "Other / Not Listed" || selectedLevel3 === "Other / Not Listed") {
      isBridgingRequired = true
      customMessage = "Please contact us for a manual assessment of your 'Other / Not Listed' qualifications."
    } else {
      // Condition 1: If a direct Level 3 recognised qualification is selected in the L3 dropdown
      if (selectedLevel3 && recognisedLevel3Direct.includes(selectedLevel3)) {
        isBridgingRequired = false
      }

      // Condition 2: If a specific Level 2 and Level 3 combination is selected that exempts bridging
      if (selectedLevel2 && selectedLevel3) {
        const foundCombination = bridgingExemptCombinations.some(
          (combo) => combo.level2 === selectedLevel2 && combo.level3 === selectedLevel3,
        )
        if (foundCombination) {
          isBridgingRequired = false
        }
      }
    }

    if (!isBridgingRequired) {
      setResult("✅ Bridging exam is NOT required – based on your selected qualification(s).")
    } else {
      setResult(`❌ Bridging exam IS required – based on your selected qualification(s). ${customMessage}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="w-full bg-white shadow-sm py-4 px-6 md:px-8 lg:px-12 flex justify-between items-center">
        <Link href="/">
          <Image src="/ewa_logo.png" alt="EWA Tracker Logo" width={120} height={40} className="object-contain" />
        </Link>
        <div className="flex items-center">
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">
              About Us
            </Link>
            <Link href="/services" className="text-blue-700 font-medium transition-colors">
              Services
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">
              Contact
            </Link>
          </nav>
          <MobileNav className="md:hidden" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        <section className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
            Bridging Assessment Exam – NVQ 1605 (Level 3)
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center max-w-3xl mx-auto">
            Use this tool to check if you need to sit the Bridging Assessment Exam for the NVQ 1605 qualification. You
            can select one or two qualifications (one Level 2 and one Level 3) to determine your requirement.
          </p>

          <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-6 w-full">
            <h2 className="text-2xl font-bold text-gray-800 text-center">EAL Level 3 Bridging Exam Checker</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="text-gray-700 font-medium">
                  Select your Level 2 electrical qualification (optional):
                </span>
                <select
                  value={selectedLevel2}
                  onChange={(e) => setSelectedLevel2(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Choose a Level 2 qualification --</option>
                  {sortedLevel2Qualifications.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-gray-700 font-medium">
                  Select your Level 3 electrical qualification (optional):
                </span>
                <select
                  value={selectedLevel3}
                  onChange={(e) => setSelectedLevel3(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Choose a Level 3 qualification --</option>
                  {sortedLevel3Qualifications.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-semibold"
              >
                Check Requirement
              </button>
            </form>
            {result && (
              <div
                className={`p-4 rounded-md text-center font-medium ${
                  result.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {result}
              </div>
            )}
          </div>

          <div className="mt-12 p-6 bg-blue-50 border-l-4 border-blue-500 text-blue-800 rounded-lg">
            <h2 className="text-xl font-bold mb-3">Important Notes</h2>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
              <li>The exam must be taken under formal exam conditions.</li>
              <li>Passing the bridging exam allows you to progress into completing the NVQ 1605 portfolio.</li>
              <li>
                If you select "Other / Not Listed", please contact us for a manual assessment of your qualifications.
              </li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-300 py-8 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} EWA Tracker Limited. All rights reserved.</p>
          <p className="mt-2 text-sm">Registered in England and Wales. Company No. 16413190.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <a
              href="https://www.instagram.com/ewa_tracker_ltd/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
