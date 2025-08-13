import clientPromise from "../../../../lib/mongodb"
import { Review } from "../../../../lib/models/Review"

export async function GET(request, { params }) {
  try {
    const client = await clientPromise
    const db = client.db("kanvei")

    const reviews = await Review.findByProductId(db, params.productId)
    const rating = await Review.getAverageRating(db, params.productId)

    return Response.json({ success: true, reviews, rating })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
