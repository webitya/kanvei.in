import clientPromise from "../../../lib/mongodb"
import { Product } from "../../../lib/models/Product"

export async function GET(request) {
  try {
    const client = await clientPromise
    const db = client.db("kanvei")

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")

    const filter = {}
    if (category) filter.category = category
    if (featured) filter.featured = featured === "true"

    const products = await Product.findAll(db, filter)

    return Response.json({ success: true, products })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise
    const db = client.db("kanvei")

    const productData = await request.json()
    const product = await Product.create(db, productData)

    return Response.json({ success: true, product })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
