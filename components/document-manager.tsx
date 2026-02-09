"use client"

import { useState } from "react"
import { Download } from "lucide-react" // Import Download icon

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
    title: "Complaints Policy",
    description: "How to raise concerns and complaints",
    filename: "complaints-policy.pdf",
    category: "learner",
    lastUpdated: "2026-02-01",
    version: "v1.1",
  },
  {
    id: "2",
    title: "Equal Opportunities & Diversity",
    description: "Equality and diversity policy",
    filename: "equal-opportunities-diversity-policy.pdf",
    category: "learner",
    lastUpdated: "2026-02-01",
    version: "v1.0",
  },
  {
    id: "3",
    title: "Fair Access to Assessment",
    description: "Reasonable adjustments and accessibility",
    filename: "fair-access-assessment-policy.pdf",
    category: "learner",
    lastUpdated: "2026-02-01",
    version: "v1.1",
  },
  {
    id: "4",
    title: "Health & Safety Policy",
    description: "Workplace health and safety guidelines",
    filename: "health-safety-policy.pdf",
    category: "company",
    lastUpdated: "2026-02-01",
    version: "v1.2",
  },
  {
    id: "5",
    title: "Conflict of Interest Policy",
    description: "Managing conflicts in assessment processes",
    filename: "conflict-of-interest-policy.pdf",
    category: "company",
    lastUpdated: "2026-02-01",
    version: "v1.2",
  },
  {
    id: "6",
    title: "Data Protection Policy",
    description: "GDPR compliance and data handling procedures",
    filename: "data-protection-policy.pdf",
    category: "company",
    lastUpdated: "2026-02-01",
    version: "v1.0",
  },
  {
    id: "7",
    title: "Internal Quality Assurance (IQA)",
    description: "Quality assurance and assessment monitoring",
    filename: "internal-quality-assurance-policy.pdf",
    category: "company",
    lastUpdated: "2026-02-01",
    version: "v1.2",
  },
  {
    id: "8",
    title: "Standardisation Plan",
    description: "Ensuring consistent and reliable assessment decisions",
    filename: "standardisation-plan.pdf",
    category: "company",
    lastUpdated: "2026-02-01",
    version: "v1.1",
  },
  {
    id: "9",
    title: "Assessment Plan",
    description: "Assessment delivery, methods, and scheduling",
    filename: "assessment-plan.pdf",
    category: "company",
    lastUpdated: "2026-02-01",
    version: "v1.0",
  },
  {
    id: "10",
    title: "Learner Appeals Procedure",
    description: "How learners can appeal assessment decisions",
    filename: "learner-appeals-procedure.pdf",
    category: "learner",
    lastUpdated: "2026-02-01",
    version: "v1.0",
  },
  {
    id: "11",
    title: "Whistleblowing Policy",
    description: "Protected disclosure and reporting procedures",
    filename: "whistleblowing-policy.pdf",
    category: "company",
    lastUpdated: "2026-02-01",
    version: "v1.1",
  },
  {
    id: "12",
    title: "Recognition of Prior Learning (RPL)",
    description: "Prior learning recognition and credit procedures",
    filename: "recognition-prior-learning-policy.pdf",
    category: "learner",
    lastUpdated: "2026-02-01",
    version: "v1.1",
  },
  {
    id: "13",
    title: "Safeguarding Policy",
    description: "Learner and staff safeguarding procedures",
    filename: "safeguarding-policy.pdf",
    category: "company",
    lastUpdated: "2026-02-01",
    version: "v1.1",
  },
  {
    id: "14",
    title: "Staff Expertise & Competence Evaluation",
    description: "IQA-focused staff competence and expertise assessment",
    filename: "staff-expertise-competence-evaluation.pdf",
    category: "company",
    lastUpdated: "2026-02-01",
    version: "v1.0",
  },
  {
    id: "15",
    title: "Malpractice & Maladministration Policy",
    description: "Prevention and management of assessment irregularities",
    filename: "malpractice-maladministration-policy.pdf",
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
                <span className="text-xs text-gray-500">Updated: {new Date(doc.lastUpdated).toLocaleDateString()}</span>
                <a
                  href={`/documents/${doc.filename}`}
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
