import clientPromise from "../../../../lib/mongodb"
import { Product } from "../../../../lib/models/Product"

export async function GET(request, { params }) {
  try {
    const client = await clientPromise
    const db = client.db("kanvei")

    const product = await Product.findById(db, params.id)

    if (!product) {
      return Response.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    return Response.json({ success: true, product })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const client = await clientPromise
    const db = client.db("kanvei")

    const updateData = await request.json()
    const result = await Product.updateById(db, params.id, updateData)

    if (result.matchedCount === 0) {
      return Response.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    return Response.json({ success: true, message: "Product updated successfully" })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const client = await clientPromise
    const db = client.db("kanvei")

    const result = await Product.deleteById(db, params.id)

    if (result.deletedCount === 0) {
      return Response.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    return Response.json({ success: true, message: "Product deleted successfully" })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
