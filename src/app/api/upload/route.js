import { uploadImage } from "../../../lib/cloudinary"

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!file) {
      return Response.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`

    // Upload to Cloudinary
    const result = await uploadImage(base64, "kanvei/products")

    if (result.success) {
      return Response.json({
        success: true,
        url: result.url,
        publicId: result.publicId,
      })
    } else {
      return Response.json({ success: false, error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error("Upload error:", error)
    return Response.json({ success: false, error: "Upload failed" }, { status: 500 })
  }
}
