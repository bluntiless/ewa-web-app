import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import {
  generateSubmissionId,
  formatSubmissionDate,
  getSubmissionFileName,
  type SkillsScanSubmission,
  type SkillsScanSubmissionData,
} from "@/lib/skills-scan-submission"
import { encryptJSON } from "@/lib/encryption"
import { uploadToSharePoint, isSharePointConfigured, createFolder } from "@/lib/sharepoint"
import fs from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()

    if (!formData.fullName || !formData.email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    const submissionId = generateSubmissionId()
    const submittedAt = new Date().toISOString()
    const dateStr = formatSubmissionDate(new Date())

    // Create metadata
    const metadata: SkillsScanSubmission = {
      id: submissionId,
      candidateName: formData.fullName,
      email: formData.email,
      phone: formData.phone || "",
      yearsExperience: formData.yearsExperience || "",
      submittedAt,
      status: "pending",
    }

    // Create full submission data
    const submissionData: SkillsScanSubmissionData = {
      metadata,
      formData,
    }

    // Encrypt data before storing (files are public but contents are encrypted)
    const encryptedMetadata = encryptJSON(metadata)
    const encryptedResponse = encryptJSON(submissionData)

    // Store encrypted metadata
    await put(
      `skills-scan-submissions/${submissionId}/metadata.enc`,
      encryptedMetadata,
      { access: "public", contentType: "text/plain" }
    )

    // Store encrypted response
    await put(
      `skills-scan-submissions/${submissionId}/response.enc`,
      encryptedResponse,
      { access: "public", contentType: "text/plain" }
    )

    // Generate candidate response PDF filename for reference
    const pdfFileName = getSubmissionFileName(formData.fullName, dateStr, "pdf")

    // Upload PDF to SharePoint if configured
    let sharePointUrl: string | undefined
    if (isSharePointConfigured()) {
      try {
        // Load the TESP PDF template
        const templatePath = path.join(process.cwd(), "public", "templates", "ewa-skills-scan-template.pdf")
        const templateBytes = fs.readFileSync(templatePath)
        
        // Load and modify PDF - add candidate name and submission info
        const pdfDoc = await PDFDocument.load(templateBytes)
        const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
        const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
        
        // Add a cover page with submission summary
        const [firstPage] = pdfDoc.getPages()
        const { height } = firstPage.getSize()
        
        // Draw candidate name on first page (near top)
        firstPage.drawText(`Candidate: ${formData.fullName}`, {
          x: 50,
          y: height - 50,
          size: 12,
          font: helveticaBold,
          color: rgb(0, 0, 0.5),
        })
        
        firstPage.drawText(`Submitted: ${new Date().toLocaleDateString("en-GB")}`, {
          x: 50,
          y: height - 65,
          size: 10,
          font: helvetica,
          color: rgb(0.3, 0.3, 0.3),
        })
        
        firstPage.drawText(`Reference: ${submissionId}`, {
          x: 50,
          y: height - 80,
          size: 10,
          font: helvetica,
          color: rgb(0.3, 0.3, 0.3),
        })

        const pdfBytes = await pdfDoc.save()

        // Create folder structure: Skills-Scan-Submissions/YYYY-MM
        const folderPath = `Skills-Scan-Submissions/${dateStr.substring(0, 7)}`
        await createFolder(folderPath)

        // Upload PDF to SharePoint
        const uploadResult = await uploadToSharePoint(
          folderPath,
          pdfFileName,
          Buffer.from(pdfBytes),
          "application/pdf"
        )

        if (uploadResult.success) {
          sharePointUrl = uploadResult.url
          console.log("[v0] Successfully uploaded to SharePoint:", sharePointUrl)
        } else {
          console.error("[v0] SharePoint upload failed:", uploadResult.error)
        }
      } catch (error) {
        console.error("[v0] SharePoint upload error:", error)
        // Don't fail the submission if SharePoint upload fails
      }
    } else {
      console.log("[v0] SharePoint not configured, skipping upload")
    }

    return NextResponse.json({
      success: true,
      submissionId,
      message: "Skills Scan submitted successfully",
      pdfFileName,
      sharePointUrl,
    })
  } catch (error) {
    console.error("Skills Scan submission error:", error)
    return NextResponse.json({ error: "Failed to submit Skills Scan" }, { status: 500 })
  }
}
