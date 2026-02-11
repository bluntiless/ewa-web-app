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
    downloadUrl: "https://blobs.vusercontent.net/blob/Complaints%20Policy%20EWA%20Tracker%20Ltd%20v1.1-5SKhpGv9uSST4O52YjErB9qxD4Oo5n.pdf",
    filename: "Complaints-Policy-EWA-Tracker-Ltd-v1.1.pdf",
    category: "learner",
    lastUpdated: "2026-02-01",
    version: "v1.1",
  },
  {
    id: "2",
    title: "Equal Opportunities & Diversity",
    description: "Equality and diversity policy",
    downloadUrl: "https://blobs.vusercontent.net/blob/Equal%20Opportunities%20and%20Diversity%20Policy%20EWA%20Tracker%20Ltd-XEVNBE01b9iS7hnzijhNxkDFBjqBby.pdf",
    filename: "Equal-Opportunities-and-Diversity-Policy-EWA-Tracker-Ltd.pdf",
    category: "learner",
    lastUpdated: "2026-02-01",
    version: "v1.0",
  },
  {
    id: "3",
    title: "Fair Access to Assessment",
    description: "Reasonable adjustments and accessibility",
    downloadUrl: "https://blobs.vusercontent.net/blob/Fair%20Access%20to%20Assessment%20Policy%20EWA%20Tracker%20Ltd%20v1.1-13ey4qA8jNurShEZMaAkD11nbn8bwx.pdf",
    filename: "Fair-Access-to-Assessment-Policy-EWA-Tracker-Ltd-v1.1.pdf",
    category: "learner",
    lastUpdated: "2026-02-01",
    version: "v1.1",
  },
  {
    id: "4",
    title: "Learner Appeals Procedure",
    description: "How learners can appeal assessment decisions",
    downloadUrl: "https://blobs.vusercontent.net/blob/Learner%20Appeals%20Procedure%20EWA%20Tracker%20Ltd-BIhuAKyO971ISON9pPxD0zylqHsrcw.pdf",
    filename: "Learner-Appeals-Procedure-EWA-Tracker-Ltd.pdf",
    category: "learner",
    lastUpdated: "2026-02-01",
    version: "v1.0",
  },
  {
    id: "5",
    title: "Recognition of Prior Learning (RPL)",
    description: "Prior learning recognition and credit procedures",
    downloadUrl: "https://blobs.vusercontent.net/blob/RPL%20Policy%20EWA%20Tracker%20Ltd%20v1.1-zucLa8BBn6xgYwjfybMSaGZL6xZ0pE.pdf",
    filename: "RPL-Policy-EWA-Tracker-Ltd-v1.1.pdf",
    category: "learner",
    lastUpdated: "2026-02-01",
    version: "v1.1",
  },
  {
    id: "6",
    title: "Health & Safety Policy",
    description: "Workplace health and safety guidelines",
    downloadUrl: "https://blobs.vusercontent.net/blob/Health%20%26%20Safety%20Policy%20EWA%20Tracker%20Ltd%20v1.2-qDmSKHXrVyJBXRGd8LU8F6ITnAm6xs.pdf",
    filename: "Health-and-Safety-Policy-EWA-Tracker-Ltd-v1.2.pdf",
    category: "company",
    lastUpdated: "2026-02-01",
    version: "v1.2",
  },
  {
    id: "7",
    title: "Conflict of Interest Policy",
    description: "Managing conflicts in assessment processes",
    downloadUrl: "https://blobs.vusercontent.net/blob/Conflict%20of%20Interest%20Policy%20EWA%20Tracker%20Ltd%20v1.2-9CxbaxCCfxGjBPobnGhTbh3sBbMKRQ.pdf",
    filename: "Conflict-of-Interest-Policy-EWA-Tracker-Ltd-v1.2.pdf",
    category: "company",
    lastUpdated: "2026-02-01",
    version: "v1.2",
  },
  {
    id: "8",
    title: "Data Protection Policy",
    description: "GDPR compliance and data handling procedures",
    downloadUrl: "https://blobs.vusercontent.net/blob/Data%20Protection%20Policy%20EWA%20Tracker%20Ltd%20COMPLETE-LoDW9eHjpwUzpISgeOAST41vlx97Qr.pdf",
    filename: "Data-Protection-Policy-EWA-Tracker-Ltd.pdf",
    category: "company",
    lastUpdated: "2026-02-01",
    version: "v1.0",
  },
  {
    id: "9",
    title: "Internal Quality Assurance (IQA)",
    description: "Quality assurance and assessment monitoring",
    downloadUrl: "https://blobs.vusercontent.net/blob/Internal%20Quality%20Assurance%20Policy%20EWATracker%20Ltd%20v1.2-BbQVANc5ppttaQDhWxu9Gt5IXrXjpV.pdf",
    filename: "Internal-Quality-Assurance-Policy-EWA-Tracker-Ltd-v1.2.pdf",
    category: "company",
    lastUpdated: "2026-02-01",
    version: "v1.2",
  },
  {
    id: "10",
    title: "Standardisation Plan",
    description: "Ensuring consistent and reliable assessment decisions",
    downloadUrl: "https://blobs.vusercontent.net/blob/EWA%20Tracker%20Ltd%20Standardisation%20Plan%20v1.1-GzXxMtmsUEKwaOeRTNDLGtr6wLFmqz.pdf",
    filename: "EWA-Tracker-Ltd-Standardisation-Plan-v1.1.pdf",
    category: "company",
    lastUpdated: "2026-02-01",
    version: "v1.1",
  },
  {
    id: "11",
    title: "Assessment Plan",
    description: "Assessment delivery, methods, and scheduling",
    downloadUrl: "https://blobs.vusercontent.net/blob/EWA%20Tracker%20Ltd%20Assessment%20Plan%20v1.0-vazrZ6DQlRQUtNXJiXF37fpEnSW5mM.pdf",
    filename: "EWA-Tracker-Ltd-Assessment-Plan-v1.0.pdf",
    category: "company",
    lastUpdated: "2026-02-01",
    version: "v1.0",
  },
  {
    id: "12",
    title: "Whistleblowing Policy",
    description: "Protected disclosure and reporting procedures",
    downloadUrl: "https://blobs.vusercontent.net/blob/Whistleblowing%20Policy%20EWA%20Tracker%20Ltd%20v1.1-SqcwUTPGa20dYqba1qIOkYBysejLC6.pdf",
    filename: "Whistleblowing-Policy-EWA-Tracker-Ltd-v1.1.pdf",
    category: "company",
    lastUpdated: "2026-02-01",
    version: "v1.1",
  },
  {
    id: "13",
    title: "Safeguarding Policy",
    description: "Learner and staff safeguarding procedures",
    downloadUrl: "https://blobs.vusercontent.net/blob/Safeguarding%20Policy%20EWA%20Tracker%20Ltd%20v1.1-FfzGcZFkNoqRmHI92C9FAKIsriKkh0.pdf",
    filename: "Safeguarding-Policy-EWA-Tracker-Ltd-v1.1.pdf",
    category: "company",
    lastUpdated: "2026-02-01",
    version: "v1.1",
  },
  {
    id: "14",
    title: "Staff Expertise & Competence Evaluation",
    description: "IQA-focused staff competence and expertise assessment",
    downloadUrl: "https://blobs.vusercontent.net/blob/Staff%20Expertise%20and%20Competence%20Evaluation%20IQA%20Focus-XOMjD7PRM3X4j1f3HoK9hLOWG2rq1w.pdf",
    filename: "Staff-Expertise-and-Competence-Evaluation-IQA-Focus.pdf",
    category: "company",
    lastUpdated: "2026-02-01",
    version: "v1.0",
  },
  {
    id: "15",
    title: "Malpractice & Maladministration Policy",
    description: "Prevention and management of assessment irregularities",
    downloadUrl: "https://blobs.vusercontent.net/blob/Malpractice%20and%20Maladministration%20Policy%20EWA%20Tracker%20Ltd_v1.2-bngMRIk6ehxRWicoVBmG6W3hYjhiS2.pdf",
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
                <span className="text-xs text-gray-500">Updated: {new Date(doc.lastUpdated).toLocaleDateString("en-GB")}</span>
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
