import connectDB from "../../../lib/mongodb"
import Wishlist from "../../../lib/models/Wishlist"
import Product from "../../../lib/models/Product"
import mongoose from "mongoose"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    if (!userId) {
      return Response.json({ success: false, error: "User ID required" }, { status: 400 })
    }
    const items = await Wishlist.find({ userId })
      .populate({ path: "productId", model: Product })
      .lean()
    return Response.json({ success: true, wishlist: items })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    if (!session) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }
    const { userId, productId } = await request.json()
    if (!userId || !productId) {
      return Response.json({ success: false, error: "userId and productId are required" }, { status: 400 })
    }
    const existing = await Wishlist.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      productId: new mongoose.Types.ObjectId(productId),
    })
    if (existing) {
      await Wishlist.deleteOne({ _id: existing._id })
      return Response.json({ success: true, action: "removed" })
    }
    await Wishlist.create({ userId, productId })
    return Response.json({ success: true, action: "added" })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
