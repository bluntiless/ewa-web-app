import { list } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"
import { decryptJSON } from "@/lib/encryption"
import type { SkillsScanSubmissionData } from "@/lib/skills-scan-submission"
import fs from "fs"
import path from "path"

async function getBlobUrl(pathname: string): Promise<string | null> {
  const { blobs } = await list({ prefix: pathname.split("/").slice(0, -1).join("/") + "/" })
  const blob = blobs.find((b) => b.pathname === pathname)
  return blob?.url || null
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    // Get the encrypted submission data
    const blobUrl = await getBlobUrl(`skills-scan-submissions/${id}/response.enc`)

    if (!blobUrl) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    const response = await fetch(blobUrl)
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch submission data" }, { status: 500 })
    }

    const encryptedText = await response.text()
    const data = decryptJSON<SkillsScanSubmissionData>(encryptedText)

    // Load the official TESP PDF template
    const templatePath = path.join(process.cwd(), "public", "templates", "ewa-skills-scan-template.pdf")
    let templateBytes: Buffer

    try {
      templateBytes = fs.readFileSync(templatePath)
    } catch (err) {
      console.error("Failed to read TESP template:", err)
      return NextResponse.json({ error: "TESP PDF template not found" }, { status: 500 })
    }

    // Load the PDF and discover form fields
    const pdfDoc = await PDFDocument.load(templateBytes)
    const form = pdfDoc.getForm()
    const fields = form.getFields()

    // Log all form field names and types to understand the PDF structure
    console.log("[v0] === TESP PDF FORM FIELDS (" + fields.length + " total) ===")
    const textFields: string[] = []
    const checkboxFields: string[] = []
    const radioFields: string[] = []
    const otherFields: string[] = []

    for (const field of fields) {
      const fieldName = field.getName()
      const fieldType = field.constructor.name
      
      if (fieldType.includes("Text")) {
        textFields.push(fieldName)
      } else if (fieldType.includes("Check")) {
        checkboxFields.push(fieldName)
      } else if (fieldType.includes("Radio")) {
        radioFields.push(fieldName)
      } else {
        otherFields.push(`${fieldName} (${fieldType})`)
      }
    }

    console.log("[v0] Text Fields:", JSON.stringify(textFields))
    console.log("[v0] Checkbox Fields:", JSON.stringify(checkboxFields))
    console.log("[v0] Radio Fields:", JSON.stringify(radioFields))
    console.log("[v0] Other Fields:", JSON.stringify(otherFields))
    console.log("[v0] === END FORM FIELDS ===")

    // Access form data from the correct structure
    const formData = data.formData

    // Fill all text fields based on their names
    for (const fieldName of textFields) {
      try {
        const textField = form.getTextField(fieldName)
        const fieldNameLower = fieldName.toLowerCase()
        
        // Candidate name field
        if (fieldNameLower.includes("candidate") || fieldNameLower.includes("name")) {
          textField.setText(formData.fullName || "")
          console.log(`[v0] Filled text field "${fieldName}" with: ${formData.fullName}`)
        }
        // Further knowledge required
        else if (fieldNameLower.includes("knowledge") && (fieldNameLower.includes("further") || fieldNameLower.includes("additional"))) {
          textField.setText(formData.furtherKnowledgeRequired || "")
          console.log(`[v0] Filled text field "${fieldName}" with further knowledge`)
        }
        // Further experience required  
        else if (fieldNameLower.includes("experience") && (fieldNameLower.includes("further") || fieldNameLower.includes("additional"))) {
          textField.setText(formData.furtherExperienceRequired || "")
          console.log(`[v0] Filled text field "${fieldName}" with further experience`)
        }
      } catch (err) {
        console.log(`[v0] Error filling text field "${fieldName}":`, err)
      }
    }

    // Fill checkboxes based on skill ratings
    // The checkbox field names should indicate which skill/rating they represent
    for (const fieldName of checkboxFields) {
      // We'll fill these once we know the naming pattern from the logs
      console.log(`[v0] Checkbox available: "${fieldName}"`)
    }

    // Save the filled PDF
    const pdfBytes = await pdfDoc.save()

    // Return the PDF
    const filename = `TESP_Skills_Scan_${formData.fullName?.replace(/\s+/g, "_") || "Candidate"}_${new Date().toISOString().split("T")[0]}.pdf`
    
    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}
