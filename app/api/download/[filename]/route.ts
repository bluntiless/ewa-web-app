import { NextResponse } from "next/server"
import { readFile } from "fs/promises"
import path from "path"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params

  // Sanitize filename to prevent directory traversal
  const sanitizedFilename = path.basename(filename)

  if (!sanitizedFilename.endsWith(".pdf")) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
  }

  try {
    const filePath = path.join(process.cwd(), "public", "documents", sanitizedFilename)
    const fileBuffer = await readFile(filePath)

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${sanitizedFilename}"`,
        "Content-Length": fileBuffer.length.toString(),
      },
    })
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 })
  }
}
