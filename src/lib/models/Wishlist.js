export class Wishlist {
  constructor(data) {
    this.userId = data.userId
    this.productId = data.productId
    this.createdAt = data.createdAt || new Date()
  }

  static async create(db, wishlistData) {
    const wishlist = new Wishlist(wishlistData)
    const result = await db.collection("wishlist").insertOne(wishlist)
    return { ...wishlist, _id: result.insertedId }
  }

  static async findByUserId(db, userId) {
    const { ObjectId } = require("mongodb")
    return await db
      .collection("wishlist")
      .aggregate([
        { $match: { userId: new ObjectId(userId) } },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: "$product" },
      ])
      .toArray()
  }

  static async toggle(db, userId, productId) {
    const { ObjectId } = require("mongodb")
    const existing = await db.collection("wishlist").findOne({
      userId: new ObjectId(userId),
      productId: new ObjectId(productId),
    })

    if (existing) {
      await db.collection("wishlist").deleteOne({ _id: existing._id })
      return { action: "removed" }
    } else {
      const wishlist = new Wishlist({ userId, productId })
      await db.collection("wishlist").insertOne(wishlist)
      return { action: "added" }
    }
  }

  static async isInWishlist(db, userId, productId) {
    const { ObjectId } = require("mongodb")
    const item = await db.collection("wishlist").findOne({
      userId: new ObjectId(userId),
      productId: new ObjectId(productId),
    })
    return !!item
  }
}
