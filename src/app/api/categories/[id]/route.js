import clientPromise from "../../../../lib/mongodb"
import { Category } from "../../../../lib/models/Category"

export async function GET(request, { params }) {
  try {
    const client = await clientPromise
    const db = client.db("kanvei")

    const category = await Category.findById(db, params.id)

    if (!category) {
      return Response.json({ success: false, error: "Category not found" }, { status: 404 })
    }

    return Response.json({ success: true, category })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const client = await clientPromise
    const db = client.db("kanvei")

    const updateData = await request.json()
    const result = await Category.updateById(db, params.id, updateData)

    if (result.matchedCount === 0) {
      return Response.json({ success: false, error: "Category not found" }, { status: 404 })
    }

    return Response.json({ success: true, message: "Category updated successfully" })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const client = await clientPromise
    const db = client.db("kanvei")

    const result = await Category.deleteById(db, params.id)

    if (result.deletedCount === 0) {
      return Response.json({ success: false, error: "Category not found" }, { status: 404 })
    }

    return Response.json({ success: true, message: "Category deleted successfully" })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
