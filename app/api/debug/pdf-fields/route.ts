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
    const fileSize = templateBytes.length
    
    // Try loading with different options
    const pdfDoc = await PDFDocument.load(templateBytes, { 
      ignoreEncryption: true,
      updateMetadata: false 
    })
    
    const form = pdfDoc.getForm()
    const fields = form.getFields()
    const pages = pdfDoc.getPages()

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

    // Check for annotations on each page (another way PDFs can have form fields)
    const pageInfo = pages.map((page, idx) => {
      const { width, height } = page.getSize()
      // Try to access raw annotations
      const node = page.node
      const annotsRef = node.get(pdfDoc.context.obj("Annots" as unknown as number))
      return {
        pageNumber: idx + 1,
        width,
        height,
        hasAnnotsRef: !!annotsRef,
      }
    })

    // Check for AcroForm in the document catalog
    const catalog = pdfDoc.catalog
    const acroFormRef = catalog.get(pdfDoc.context.obj("AcroForm" as unknown as number))

    return NextResponse.json({
      fileSize,
      pageCount: pages.length,
      totalFields: fields.length,
      hasAcroForm: !!acroFormRef,
      textFields,
      checkboxFields,
      radioFields,
      dropdownFields,
      otherFields,
      pageInfo,
      message: fields.length === 0 
        ? "No form fields detected. The PDF may use XFA forms (not supported by pdf-lib), or the fields may be flattened/embedded in the content stream."
        : "Form fields detected successfully."
    })
  } catch (error) {
    console.error("Error reading PDF:", error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
