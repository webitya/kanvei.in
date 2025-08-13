export class Category {
  constructor(data) {
    this.name = data.name
    this.description = data.description
    this.image = data.image || ""
    this.parentCategory = data.parentCategory || null
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

  static async findMainCategories(db) {
    return await db.collection("categories").find({ parentCategory: null }).toArray()
  }

  static async findSubcategories(db, parentId) {
    return await db.collection("categories").find({ parentCategory: parentId }).toArray()
  }

  static async findCategoriesWithSubcategories(db) {
    const mainCategories = await this.findMainCategories(db)
    const categoriesWithSubs = []

    for (const category of mainCategories) {
      const subcategories = await this.findSubcategories(db, category._id.toString())
      categoriesWithSubs.push({
        ...category,
        subcategories: subcategories,
      })
    }

    return categoriesWithSubs
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
    await db.collection("categories").deleteMany({ parentCategory: id })
    return await db.collection("categories").deleteOne({ _id: new ObjectId(id) })
  }
}
