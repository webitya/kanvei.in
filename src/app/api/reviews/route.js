import clientPromise from "../../../lib/mongodb"
import { Review } from "../../../lib/models/Review"

export async function POST(request) {
  try {
    const client = await clientPromise
    const db = client.db("kanvei")

    const reviewData = await request.json()
    const review = await Review.create(db, reviewData)

    return Response.json({ success: true, review })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
