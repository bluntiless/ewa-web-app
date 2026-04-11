/**
 * Debug script to extract all form field names from the TESP PDF template
 * Run with: npx ts-node scripts/debug-tesp-pdf-fields.ts
 */

import { PDFDocument } from "pdf-lib"
import fs from "fs"
import path from "path"

async function debugPdfFields() {
  const templatePath = path.join(process.cwd(), "public", "templates", "ewa-skills-scan-template.pdf")
  
  console.log("Loading PDF from:", templatePath)
  
  if (!fs.existsSync(templatePath)) {
    console.error("ERROR: Template PDF not found at", templatePath)
    process.exit(1)
  }
  
  const templateBytes = fs.readFileSync(templatePath)
  console.log("PDF loaded, size:", templateBytes.length, "bytes")
  
  const pdfDoc = await PDFDocument.load(templateBytes)
  const form = pdfDoc.getForm()
  const fields = form.getFields()
  
  console.log("\n=== TESP PDF FORM FIELDS ===")
  console.log("Total fields:", fields.length)
  console.log("")
  
  const textFields: string[] = []
  const checkboxFields: string[] = []
  const radioGroups: Map<string, string[]> = new Map()
  const dropdownFields: string[] = []
  const otherFields: { name: string; type: string }[] = []
  
  for (const field of fields) {
    const name = field.getName()
    const typeName = field.constructor.name
    
    if (typeName === "PDFTextField") {
      textFields.push(name)
    } else if (typeName === "PDFCheckBox") {
      checkboxFields.push(name)
    } else if (typeName === "PDFRadioGroup") {
      const radioGroup = form.getRadioGroup(name)
      const options = radioGroup.getOptions()
      radioGroups.set(name, options)
    } else if (typeName === "PDFDropdown") {
      dropdownFields.push(name)
    } else {
      otherFields.push({ name, type: typeName })
    }
  }
  
  console.log("--- TEXT FIELDS (" + textFields.length + ") ---")
  textFields.forEach(name => console.log(`  "${name}"`))
  
  console.log("\n--- CHECKBOX FIELDS (" + checkboxFields.length + ") ---")
  checkboxFields.forEach(name => console.log(`  "${name}"`))
  
  console.log("\n--- RADIO GROUPS (" + radioGroups.size + ") ---")
  radioGroups.forEach((options, name) => {
    console.log(`  "${name}" -> options: [${options.join(", ")}]`)
  })
  
  console.log("\n--- DROPDOWN FIELDS (" + dropdownFields.length + ") ---")
  dropdownFields.forEach(name => console.log(`  "${name}"`))
  
  if (otherFields.length > 0) {
    console.log("\n--- OTHER FIELDS (" + otherFields.length + ") ---")
    otherFields.forEach(f => console.log(`  "${f.name}" (${f.type})`))
  }
  
  console.log("\n=== END FORM FIELDS ===")
  
  // Output JSON for easy mapping
  console.log("\n=== JSON OUTPUT ===")
  console.log(JSON.stringify({
    textFields,
    checkboxFields,
    radioGroups: Object.fromEntries(radioGroups),
    dropdownFields,
    otherFields,
  }, null, 2))
}

debugPdfFields().catch(console.error)
