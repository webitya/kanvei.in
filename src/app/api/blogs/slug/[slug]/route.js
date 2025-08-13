import { NextResponse } from "next/server"
import { Blog } from "../../../../../lib/models/Blog.js"

export async function GET(request, { params }) {
  try {
    const { slug } = params
    const blog = await Blog.findBySlug(slug)

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json(blog)
  } catch (error) {
    console.error("Error fetching blog by slug:", error)
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 })
  }
}
