"use client"

import Link from "next/link"
import { FileText, ClipboardCheck, Download, Upload, CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SkillsScanOptionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            TESP Skills Scan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The Training &amp; Experience Skills Profile (TESP) Skills Scan helps assess your suitability 
            for the Installation &amp; Maintenance Electrician Experienced Worker Assessment.
          </p>
        </div>

        {/* Two Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Option 1: Self-Check */}
          <div className="bg-white border-2 border-blue-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ClipboardCheck className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Preliminary Self-Check</h2>
            </div>
            
            <p className="text-gray-600 mb-4">
              Complete an online self-assessment to get an instant preliminary indication of your 
              suitability before committing to the official submission.
            </p>

            <div className="space-y-2 mb-6">
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Instant feedback on your knowledge and experience levels</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>See your preliminary suitability indication</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Identify areas that may need development</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Then proceed to official submission if suitable</span>
              </div>
            </div>

            <p className="text-xs text-blue-700 bg-blue-50 p-2 rounded mb-4">
              <strong>Recommended</strong> if you want to check your suitability before completing the official TESP form.
            </p>

            <Link href="/candidate-check">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Start Self-Check
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Option 2: Direct PDF Submission */}
          <div className="bg-white border-2 border-green-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Official TESP Submission</h2>
            </div>
            
            <p className="text-gray-600 mb-4">
              Download the official TESP Skills Scan PDF, complete it in Adobe Reader, 
              and upload it directly for Training Provider review.
            </p>

            <div className="space-y-2 mb-6">
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <Download className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Download the official fillable TESP PDF</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <FileText className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Complete it in Adobe Acrobat Reader</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <Upload className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Upload your completed PDF</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Submitted directly to Training Provider</span>
              </div>
            </div>

            <p className="text-xs text-green-700 bg-green-50 p-2 rounded mb-4">
              <strong>Best for</strong> candidates who are confident in their experience and ready to submit officially.
            </p>

            <Link href="/skills-scan">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Go to Official Submission
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Info Note */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> Both options assess your skills against the same criteria. 
            The self-check provides instant feedback, while the official submission goes directly to a Training Provider for review.
          </p>
        </div>
      </div>
    </div>
  )
}
