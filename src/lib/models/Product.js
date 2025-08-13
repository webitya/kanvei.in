export class Product {
  constructor(data) {
    this.name = data.name
    this.description = data.description
    this.price = data.price
    this.category = data.category
    this.images = data.images || []
    this.stock = data.stock || 0
    this.featured = data.featured || false
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
  }

  static async create(db, productData) {
    const product = new Product(productData)
    const result = await db.collection("products").insertOne(product)
    return { ...product, _id: result.insertedId }
  }

  static async findAll(db, filter = {}) {
    return await db.collection("products").find(filter).toArray()
  }

  static async findById(db, id) {
    const { ObjectId } = require("mongodb")
    return await db.collection("products").findOne({ _id: new ObjectId(id) })
  }

  static async updateById(db, id, updateData) {
    const { ObjectId } = require("mongodb")
    updateData.updatedAt = new Date()
    return await db.collection("products").updateOne({ _id: new ObjectId(id) }, { $set: updateData })
  }

  static async deleteById(db, id) {
    const { ObjectId } = require("mongodb")
    return await db.collection("products").deleteOne({ _id: new ObjectId(id) })
  }
}
