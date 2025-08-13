import { NextResponse } from "next/server"
import { Blog } from "../../../lib/models/Blog.js"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get("published")
    const limit = Number.parseInt(searchParams.get("limit")) || 0
    const page = Number.parseInt(searchParams.get("page")) || 1
    const search = searchParams.get("search")
    const sort = searchParams.get("sort") || "newest"

    const skip = (page - 1) * (limit || 0)

    let sortOptions = { createdAt: -1 }
    if (sort === "oldest") sortOptions = { createdAt: 1 }
    if (sort === "title") sortOptions = { title: 1 }

    const options = {
      published: published === "true" ? true : published === "false" ? false : null,
      limit,
      skip,
      sort: sortOptions,
      search,
    }

    const blogs = await Blog.findAll(options)
    const totalCount = await Blog.getCount(options.published)

    return NextResponse.json({
      blogs,
      pagination: {
        total: totalCount,
        page,
        limit: limit || totalCount,
        totalPages: limit ? Math.ceil(totalCount / limit) : 1,
      },
    })
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()

    // Generate slug if not provided
    if (!data.slug && data.title) {
      data.slug = Blog.generateSlug(data.title)
    }

    // Calculate read time if content is provided
    if (data.content) {
      data.readTime = Blog.calculateReadTime(data.content)
    }

    // Set published date if publishing
    if (data.published && !data.publishedAt) {
      data.publishedAt = new Date()
    }

    const blog = new Blog(data)
    const savedBlog = await blog.save()

    return NextResponse.json(savedBlog, { status: 201 })
  } catch (error) {
    console.error("Error creating blog:", error)
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 })
  }
}
