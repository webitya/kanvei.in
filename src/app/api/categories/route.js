import clientPromise from "../../../lib/mongodb"
import { Category } from "../../../lib/models/Category"

export async function GET(request) {
  try {
    const client = await clientPromise
    const db = client.db("kanvei")

    const { searchParams } = new URL(request.url)
    const mainOnly = searchParams.get("mainOnly") === "true"
    const withHierarchy = searchParams.get("withHierarchy") === "true"

    let categories

    if (mainOnly) {
      // Return only main categories (no parent)
      categories = await Category.findMainCategories(db)
    } else if (withHierarchy) {
      // Return categories with their subcategories nested
      categories = await Category.findCategoriesWithSubcategories(db)
    } else {
      // Return all categories (existing behavior)
      categories = await Category.findAll(db)
    }

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
