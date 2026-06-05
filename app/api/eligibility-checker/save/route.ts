import { NextRequest, NextResponse } from "next/server"
import { uploadToSharePoint, checkFolderExists, createFolder, isSharePointConfigured } from "@/lib/sharepoint"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { 
      candidateName, 
      checkDate, 
      email,
      phone,
      // Support both old field names and new field names from the HTML form
      qualificationsA,
      qualificationsB,
      qualificationsC,
      level2Qualification,
      level3Qualification,
      experience,
      bs7671Status,
      itStatus,
      workTypes,
      eligibilityResult,
      recommendations
    } = data
    
    // Map the qualifications - the HTML form sends level2Qualification and level3Qualification
    // but the API was expecting qualificationsA, qualificationsB, qualificationsC
    const mappedQualificationsA = qualificationsA || (level2Qualification ? [level2Qualification] : [])
    const mappedQualificationsB = qualificationsB || (level3Qualification ? [level3Qualification] : [])
    const mappedQualificationsC = qualificationsC || (experience ? [experience] : [])

    if (!candidateName) {
      return NextResponse.json({ error: "Candidate name is required" }, { status: 400 })
    }

    if (!isSharePointConfigured()) {
      return NextResponse.json({ error: "SharePoint is not configured" }, { status: 500 })
    }

    // Create folder structure: Eligibility-Checks/{CandidateName}/
    const sanitizedName = candidateName.replace(/[^a-zA-Z0-9\s-]/g, "").trim()
    const folderPath = `Eligibility-Checks/${sanitizedName}`
    
    // Ensure folders exist
    const parentExists = await checkFolderExists("Eligibility-Checks")
    if (!parentExists) {
      await createFolder("Eligibility-Checks")
    }
    
    const candidateFolderExists = await checkFolderExists(folderPath)
    if (!candidateFolderExists) {
      await createFolder(folderPath)
    }

    // Generate HTML document
    const timestamp = new Date().toISOString().split("T")[0]
    const fileName = `Eligibility-Check_${timestamp}.html`

    const formatList = (items: string[] | undefined) => {
      if (!items || items.length === 0) return "<li>None specified</li>"
      return items.map(item => `<li>${item}</li>`).join("")
    }

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>EWA Eligibility Check - ${candidateName}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
    h1 { color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px; }
    h2 { color: #374151; margin-top: 30px; font-size: 18px; }
    h3 { color: #4b5563; margin-top: 20px; font-size: 16px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #1e40af; }
    .date { color: #6b7280; }
    .section { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .field { margin: 10px 0; }
    .label { font-weight: bold; color: #374151; }
    .value { color: #111827; }
    .result-eligible { background: #d1fae5; border: 2px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .result-not-eligible { background: #fee2e2; border: 2px solid #ef4444; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .result-partial { background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .result-text { font-size: 20px; font-weight: bold; }
    .eligible { color: #059669; }
    .not-eligible { color: #dc2626; }
    .partial { color: #d97706; }
    ul { margin: 10px 0; padding-left: 20px; }
    li { margin: 5px 0; }
    .recommendations { background: #eff6ff; border: 1px solid #3b82f6; padding: 15px; border-radius: 8px; margin: 20px 0; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">EWA Tracker</div>
    <div class="date">Generated: ${new Date().toLocaleDateString("en-GB")}</div>
  </div>
  
  <h1>Eligibility Check Result</h1>
  
  <div class="section">
    <h2>Candidate Details</h2>
    <div class="field"><span class="label">Name:</span> <span class="value">${candidateName}</span></div>
    <div class="field"><span class="label">Check Date:</span> <span class="value">${checkDate || new Date().toLocaleDateString("en-GB")}</span></div>
    ${email ? `<div class="field"><span class="label">Email:</span> <span class="value">${email}</span></div>` : ""}
    ${phone ? `<div class="field"><span class="label">Phone:</span> <span class="value">${phone}</span></div>` : ""}
  </div>
  
  <div class="section">
    <h2>Qualifications</h2>
    
    <h3>Category A - Level 2 Qualifications</h3>
    <ul>\${formatList(mappedQualificationsA)}</ul>
    
    <h3>Category B - Level 3 Qualifications</h3>
    <ul>\${formatList(mappedQualificationsB)}</ul>
    
    <h3>Category C - Experience & Supporting Info</h3>
    <ul>\${formatList(mappedQualificationsC)}</ul>
  </div>
  
  <div class="section">
    <h2>Current Status</h2>
    <div class="field"><span class="label">BS 7671 (18th Edition):</span> <span class="value">${bs7671Status || "Not specified"}</span></div>
    <div class="field"><span class="label">Inspection & Testing:</span> <span class="value">${itStatus || "Not specified"}</span></div>
  </div>
  
  ${workTypes && workTypes.length > 0 ? `
  <div class="section">
    <h2>Work Types</h2>
    <ul>${formatList(workTypes)}</ul>
  </div>
  ` : ""}
  
  <div class="${eligibilityResult?.includes("Eligible") ? "result-eligible" : eligibilityResult?.includes("Not") ? "result-not-eligible" : "result-partial"}">
    <h2>Eligibility Result</h2>
    <div class="result-text ${eligibilityResult?.includes("Eligible") ? "eligible" : eligibilityResult?.includes("Not") ? "not-eligible" : "partial"}">
      ${eligibilityResult || "Pending Review"}
    </div>
  </div>
  
  ${recommendations ? `
  <div class="recommendations">
    <h2>Recommendations & Next Steps</h2>
    <p>${recommendations.replace(/\n/g, "<br>")}</p>
  </div>
  ` : ""}
  
  <p style="color: #6b7280; font-size: 12px; margin-top: 40px;">
    This document was generated by EWA Tracker Eligibility Checker. 
    For queries, contact support@ewatracker.co.uk
  </p>
</body>
</html>
`

    // Upload to SharePoint
    const fileBuffer = Buffer.from(htmlContent, "utf-8")
    const result = await uploadToSharePoint(folderPath, fileName, fileBuffer, "text/html")

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to upload" }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: `Eligibility check saved to SharePoint: ${folderPath}/${fileName}`,
      filePath: `${folderPath}/${fileName}`,
      url: result.url
    })

  } catch (error) {
    console.error("Error saving eligibility check to SharePoint:", error)
    return NextResponse.json(
      { error: "Failed to save to SharePoint", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
