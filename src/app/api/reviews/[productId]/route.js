import connectDB from "../../../../lib/mongodb"
import Review from "../../../../lib/models/Review"

export async function GET(request, { params }) {
  try {
    await connectDB()
    const { productId } = await params
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 }).lean()
    const agg = await Review.aggregate([
      { $match: { productId: new (await import("mongoose")).Types.ObjectId(productId) } },
      { $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
    ])
    const rating = agg.length > 0 ? { average: agg[0].avgRating, count: agg[0].count } : { average: 0, count: 0 }
    return Response.json({ success: true, reviews, rating })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
