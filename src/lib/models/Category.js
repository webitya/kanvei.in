export class Category {
  constructor(data) {
    this.name = data.name
    this.description = data.description
    this.image = data.image || ""
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
  }

  static async create(db, categoryData) {
    const category = new Category(categoryData)
    const result = await db.collection("categories").insertOne(category)
    return { ...category, _id: result.insertedId }
  }

  static async findAll(db) {
    return await db.collection("categories").find({}).toArray()
  }

  static async findById(db, id) {
    const { ObjectId } = require("mongodb")
    return await db.collection("categories").findOne({ _id: new ObjectId(id) })
  }

  static async updateById(db, id, updateData) {
    const { ObjectId } = require("mongodb")
    updateData.updatedAt = new Date()
    return await db.collection("categories").updateOne({ _id: new ObjectId(id) }, { $set: updateData })
  }

  static async deleteById(db, id) {
    const { ObjectId } = require("mongodb")
    return await db.collection("categories").deleteOne({ _id: new ObjectId(id) })
  }
}
