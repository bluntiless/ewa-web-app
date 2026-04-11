import { NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Load the official TESP PDF template
    const templatePath = path.join(process.cwd(), "public", "templates", "ewa-skills-scan-template.pdf")
    
    if (!fs.existsSync(templatePath)) {
      return NextResponse.json({ error: "Template not found at: " + templatePath }, { status: 404 })
    }

    const templateBytes = fs.readFileSync(templatePath)
    const pdfDoc = await PDFDocument.load(templateBytes)
    const form = pdfDoc.getForm()
    const fields = form.getFields()

    const textFields: string[] = []
    const checkboxFields: string[] = []
    const radioFields: string[] = []
    const dropdownFields: string[] = []
    const otherFields: { name: string; type: string }[] = []

    for (const field of fields) {
      const fieldName = field.getName()
      const fieldType = field.constructor.name

      if (fieldType.includes("Text")) {
        textFields.push(fieldName)
      } else if (fieldType.includes("Check")) {
        checkboxFields.push(fieldName)
      } else if (fieldType.includes("Radio")) {
        radioFields.push(fieldName)
      } else if (fieldType.includes("Dropdown") || fieldType.includes("Option")) {
        dropdownFields.push(fieldName)
      } else {
        otherFields.push({ name: fieldName, type: fieldType })
      }
    }

    return NextResponse.json({
      totalFields: fields.length,
      textFields,
      checkboxFields,
      radioFields,
      dropdownFields,
      otherFields,
    })
  } catch (error) {
    console.error("Error reading PDF:", error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
