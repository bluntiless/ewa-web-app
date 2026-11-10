"use client"

import { useState } from "react"

interface Document {
  id: string
  title: string
  description: string
  filename: string
  category: "learner" | "company"
  lastUpdated: string
  version: string
}

const documents: Document[] = [
  {
    id: "1",
    title: "Learner Handbook",
    description: "Complete guide for learners",
    filename: "learner-handbook.docx",
    category: "learner",
    lastUpdated: "2025-01-15",
    version: "v2.1",
  },
  {
    id: "2",
    title: "Assessment Policy",
    description: "Assessment procedures and guidelines",
    filename: "assessment-policy.docx",
    category: "learner",
    lastUpdated: "2025-01-10",
    version: "v1.3",
  },
  // Add more documents as needed
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
                <span className="text-xs text-gray-500">Updated: {new Date(doc.lastUpdated).toLocaleDateString()}</span>
                <a
                  href={`/documents/${doc.filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
