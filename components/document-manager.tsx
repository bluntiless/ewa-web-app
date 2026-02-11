"use client"

import { useState } from "react"
import { Download } from "lucide-react" // Import Download icon

interface Document {
  id: string
  title: string
  description: string
  downloadUrl: string
  filename: string
  category: "learner" | "company"
  lastUpdated: string
  version: string
}

const documents: Document[] = [
  {
    id: "1",
    title: "Complaints Policy",
    description: "How to raise concerns and complaints",
    downloadUrl: "https://zhnuwua2l3oqthoy.public.blob.vercel-storage.com/documents/Complaints-Policy-EWA-Tracker-Ltd-v1.1.pdf",
    filename: "Complaints-Policy-EWA-Tracker-Ltd-v1.1.pdf",
    category: "learner",
    lastUpdated: "2026-02-01",
    version: "v1.1",
  },
  {
    id: "2",
    title: "Equal Opportunities & Diversity",
    description: "Equality and diversity policy",
    downloadUrl: "https://zhnuwua2l3oqthoy.public.blob.vercel-storage.com/documents/Equal-Opportunities-and-Diversity-Policy-EWA-Tracker-Ltd.pdf",
    filename: "Equal-Opportunities-and-Diversity-Policy-EWA-Tracker-Ltd.pdf",
    category: "learner",
    lastUpdated: "2026-02-01",
    version: "v1.0",
  },
  {
    id: "3",
    title: "Fair Access to Assessment",
    description: "Reasonable adjustments and accessibility",
    downloadUrl: "https://zhnuwua2l3oqthoy.public.blob.vercel-storage.com/documents/Fair-Access-to-Assessment-Policy-EWA-Tracker-Ltd-v1.1.pdf",
    filename: "Fair-Access-to-Assessment-Policy-EWA-Tracker-Ltd-v1.1.pdf",
    category: "learner",
    lastUpdated: "2026-02-01",
    version: "v1.1",
  },
  {
    id: "4",
    title: "Learner Appeals Procedure",
    description: "How learners can appeal assessment decisions",
    downloadUrl: "https://zhnuwua2l3oqthoy.public.blob.vercel-storage.com/documents/Learner-Appeals-Procedure-EWA-Tracker-Ltd.pdf",
    filename: "Learner-Appeals-Procedure-EWA-Tracker-Ltd.pdf",
    category: "learner",
    lastUpdated: "2026-02-01",
    version: "v1.0",
  },
  {
    id: "5",
    title: "Recognition of Prior Learning (RPL)",
    description: "Prior learning recognition and credit procedures",
    downloadUrl: "https://zhnuwua2l3oqthoy.public.blob.vercel-storage.com/documents/RPL-Policy-EWA-Tracker-Ltd-v1.1.pdf",
    filename: "RPL-Policy-EWA-Tracker-Ltd-v1.1.pdf",
    category: "learner",
    lastUpdated: "2026-02-01",
    version: "v1.1",
  },
  {
    id: "6",
    title: "Health & Safety Policy",
    description: "Workplace health and safety guidelines",
    downloadUrl: "https://zhnuwua2l3oqthoy.public.blob.vercel-storage.com/documents/Health-and-Safety-Policy-EWA-Tracker-Ltd-v1.2.pdf",
    filename: "Health-and-Safety-Policy-EWA-Tracker-Ltd-v1.2.pdf",
    category: "company",
    lastUpdated: "2026-02-01",
    version: "v1.2",
  },
  {
    id: "7",
    title: "Conflict of Interest Policy",
    description: "Managing conflicts in assessment processes",
    downloadUrl: "https://zhnuwua2l3oqthoy.public.blob.vercel-storage.com/documents/Conflict-of-Interest-Policy-EWA-Tracker-Ltd-v1.2.pdf",
    filename: "Conflict-of-Interest-Policy-EWA-Tracker-Ltd-v1.2.pdf",
    category: "company",
    lastUpdated: "2026-02-01",
    version: "v1.2",
  },
  {
    id: "8",
    title: "Data Protection Policy",
    description: "GDPR compliance and data handling procedures",
    downloadUrl: "https://zhnuwua2l3oqthoy.public.blob.vercel-storage.com/documents/Data-Protection-Policy-EWA-Tracker-Ltd.pdf",
    filename: "Data-Protection-Policy-EWA-Tracker-Ltd.pdf",
    category: "company",
    lastUpdated: "2026-02-01",
    version: "v1.0",
  },
  {
    id: "9",
    title: "Internal Quality Assurance (IQA)",
    description: "Quality assurance and assessment monitoring",
    downloadUrl: "https://zhnuwua2l3oqthoy.public.blob.vercel-storage.com/documents/Internal-Quality-Assurance-Policy-EWA-Tracker-Ltd-v1.2.pdf",
    filename: "Internal-Quality-Assurance-Policy-EWA-Tracker-Ltd-v1.2.pdf",
    category: "company",
    lastUpdated: "2026-02-01",
    version: "v1.2",
  },
  {
    id: "10",
    title: "Standardisation Plan",
    description: "Ensuring consistent and reliable assessment decisions",
    downloadUrl: "https://zhnuwua2l3oqthoy.public.blob.vercel-storage.com/documents/EWA-Tracker-Ltd-Standardisation-Plan-v1.1.pdf",
    filename: "EWA-Tracker-Ltd-Standardisation-Plan-v1.1.pdf",
    category: "company",
    lastUpdated: "2026-02-01",
    version: "v1.1",
  },
  {
    id: "11",
    title: "Assessment Plan",
    description: "Assessment delivery, methods, and scheduling",
    downloadUrl: "https://zhnuwua2l3oqthoy.public.blob.vercel-storage.com/documents/EWA-Tracker-Ltd-Assessment-Plan-v1.0.pdf",
    filename: "EWA-Tracker-Ltd-Assessment-Plan-v1.0.pdf",
    category: "company",
    lastUpdated: "2026-02-01",
    version: "v1.0",
  },
  {
    id: "12",
    title: "Whistleblowing Policy",
    description: "Protected disclosure and reporting procedures",
    downloadUrl: "https://zhnuwua2l3oqthoy.public.blob.vercel-storage.com/documents/Whistleblowing-Policy-EWA-Tracker-Ltd-v1.1.pdf",
    filename: "Whistleblowing-Policy-EWA-Tracker-Ltd-v1.1.pdf",
    category: "company",
    lastUpdated: "2026-02-01",
    version: "v1.1",
  },
  {
    id: "13",
    title: "Safeguarding Policy",
    description: "Learner and staff safeguarding procedures",
    downloadUrl: "https://zhnuwua2l3oqthoy.public.blob.vercel-storage.com/documents/Safeguarding-Policy-EWA-Tracker-Ltd-v1.1.pdf",
    filename: "Safeguarding-Policy-EWA-Tracker-Ltd-v1.1.pdf",
    category: "company",
    lastUpdated: "2026-02-01",
    version: "v1.1",
  },
  {
    id: "14",
    title: "Staff Expertise & Competence Evaluation",
    description: "IQA-focused staff competence and expertise assessment",
    downloadUrl: "https://zhnuwua2l3oqthoy.public.blob.vercel-storage.com/documents/Staff-Expertise-and-Competence-Evaluation-IQA-Focus.pdf",
    filename: "Staff-Expertise-and-Competence-Evaluation-IQA-Focus.pdf",
    category: "company",
    lastUpdated: "2026-02-01",
    version: "v1.0",
  },
  {
    id: "15",
    title: "Malpractice & Maladministration Policy",
    description: "Prevention and management of assessment irregularities",
    downloadUrl: "https://zhnuwua2l3oqthoy.public.blob.vercel-storage.com/documents/Malpractice-and-Maladministration-Policy-EWA-Tracker-Ltd-v1.2.pdf",
    filename: "Malpractice-and-Maladministration-Policy-EWA-Tracker-Ltd-v1.2.pdf",
    category: "company",
    lastUpdated: "2026-02-01",
    version: "v1.2",
  },
]

export default function DocumentManager() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredDocs = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Policies & Procedures</h2>
          <p className="text-lg text-gray-600">Access our comprehensive policies and procedures documentation</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDocs.map((doc) => (
            <div key={doc.id} className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{doc.title}</h3>
                  <p className="text-sm text-gray-600">{doc.description}</p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{doc.version}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500" suppressHydrationWarning>Updated: {new Date(doc.lastUpdated).toLocaleDateString("en-GB")}</span>
                <a
                  href={doc.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" /> Download
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
