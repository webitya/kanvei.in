import { NextResponse } from "next/server"
import { Blog } from "../../../../lib/models/Blog.js"

export async function GET(request, { params }) {
  try {
    const { id } = params
    const blog = await Blog.findById(id)

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json(blog)
  } catch (error) {
    console.error("Error fetching blog:", error)
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const data = await request.json()

    const existingBlog = await Blog.findById(id)
    if (!existingBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    // Update slug if title changed
    if (data.title && data.title !== existingBlog.title && !data.slug) {
      data.slug = Blog.generateSlug(data.title)
    }

    // Calculate read time if content changed
    if (data.content && data.content !== existingBlog.content) {
      data.readTime = Blog.calculateReadTime(data.content)
    }

    // Set published date if publishing for first time
    if (data.published && !existingBlog.published && !data.publishedAt) {
      data.publishedAt = new Date()
    }

    const updatedBlog = new Blog({ ...existingBlog, ...data, _id: id })
    const savedBlog = await updatedBlog.save()

    return NextResponse.json(savedBlog)
  } catch (error) {
    console.error("Error updating blog:", error)
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    const deleted = await Blog.deleteById(id)

    if (!deleted) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Blog deleted successfully" })
  } catch (error) {
    console.error("Error deleting blog:", error)
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 })
  }
}
