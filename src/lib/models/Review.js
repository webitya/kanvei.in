export class Review {
  constructor(data) {
    this.productId = data.productId
    this.userId = data.userId
    this.userName = data.userName
    this.rating = data.rating
    this.comment = data.comment
    this.createdAt = data.createdAt || new Date()
  }

  static async create(db, reviewData) {
    const review = new Review(reviewData)
    const result = await db.collection("reviews").insertOne(review)
    return { ...review, _id: result.insertedId }
  }

  static async findByProductId(db, productId) {
    const { ObjectId } = require("mongodb")
    return await db
      .collection("reviews")
      .find({ productId: new ObjectId(productId) })
      .sort({ createdAt: -1 })
      .toArray()
  }

  static async getAverageRating(db, productId) {
    const { ObjectId } = require("mongodb")
    const result = await db
      .collection("reviews")
      .aggregate([
        { $match: { productId: new ObjectId(productId) } },
        { $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
      ])
      .toArray()

    return result.length > 0 ? { average: result[0].avgRating, count: result[0].count } : { average: 0, count: 0 }
  }
}
