import clientPromise from "../../../lib/mongodb"
import { Wishlist } from "../../../lib/models/Wishlist"

export async function GET(request) {
  try {
    const client = await clientPromise
    const db = client.db("kanvei")

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return Response.json({ success: false, error: "User ID required" }, { status: 400 })
    }

    const wishlist = await Wishlist.findByUserId(db, userId)
    return Response.json({ success: true, wishlist })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise
    const db = client.db("kanvei")

    const { userId, productId } = await request.json()
    const result = await Wishlist.toggle(db, userId, productId)

    return Response.json({ success: true, ...result })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
