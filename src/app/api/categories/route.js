import clientPromise from "../../../lib/mongodb"
import { Category } from "../../../lib/models/Category"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("kanvei")

    const categories = await Category.findAll(db)

    return Response.json({ success: true, categories })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise
    const db = client.db("kanvei")

    const categoryData = await request.json()
    const category = await Category.create(db, categoryData)

    return Response.json({ success: true, category })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
