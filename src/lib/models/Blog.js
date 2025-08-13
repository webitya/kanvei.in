import clientPromise from "../mongodb.js"

export class Blog {
  constructor(data) {
    this.title = data.title
    this.slug = data.slug
    this.heroImage = data.heroImage
    this.description = data.description
    this.subtitle = data.subtitle
    this.content = data.content
    this.youtubeLinks = data.youtubeLinks || []
    this.additionalLinks = data.additionalLinks || []
    this.author = data.author
    this.tags = data.tags || []
    this.published = data.published || false
    this.publishedAt = data.publishedAt
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
    this.metaTitle = data.metaTitle
    this.metaDescription = data.metaDescription
    this.readTime = data.readTime
  }

  static async getCollection() {
    const client = await clientPromise
    const db = client.db("kanvei_ecommerce")
    return db.collection("blogs")
  }

  static async findAll(options = {}) {
    try {
      const collection = await this.getCollection()
      const { published = null, limit = 0, skip = 0, sort = { createdAt: -1 }, search = null } = options

      const query = {}

      if (published !== null) {
        query.published = published
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { tags: { $in: [new RegExp(search, "i")] } },
        ]
      }

      const blogs = await collection.find(query).sort(sort).skip(skip).limit(limit).toArray()

      return blogs.map((blog) => ({ ...blog, _id: blog._id.toString() }))
    } catch (error) {
      console.error("Error finding blogs:", error)
      throw error
    }
  }

  static async findById(id) {
    try {
      const collection = await this.getCollection()
      const { ObjectId } = await import("mongodb")
      const blog = await collection.findOne({ _id: new ObjectId(id) })
      return blog ? { ...blog, _id: blog._id.toString() } : null
    } catch (error) {
      console.error("Error finding blog by ID:", error)
      throw error
    }
  }

  static async findBySlug(slug) {
    try {
      const collection = await this.getCollection()
      const blog = await collection.findOne({ slug })
      return blog ? { ...blog, _id: blog._id.toString() } : null
    } catch (error) {
      console.error("Error finding blog by slug:", error)
      throw error
    }
  }

  async save() {
    try {
      const collection = await Blog.getCollection()
      this.updatedAt = new Date()

      if (this._id) {
        const { ObjectId } = await import("mongodb")
        const { _id, ...updateData } = this
        await collection.updateOne({ _id: new ObjectId(_id) }, { $set: updateData })
        return { ...this, _id }
      } else {
        const result = await collection.insertOne(this)
        return { ...this, _id: result.insertedId.toString() }
      }
    } catch (error) {
      console.error("Error saving blog:", error)
      throw error
    }
  }

  static async deleteById(id) {
    try {
      const collection = await this.getCollection()
      const { ObjectId } = await import("mongodb")
      const result = await collection.deleteOne({ _id: new ObjectId(id) })
      return result.deletedCount > 0
    } catch (error) {
      console.error("Error deleting blog:", error)
      throw error
    }
  }

  static async getCount(published = null) {
    try {
      const collection = await this.getCollection()
      const query = published !== null ? { published } : {}
      return await collection.countDocuments(query)
    } catch (error) {
      console.error("Error getting blog count:", error)
      throw error
    }
  }

  static generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-")
  }

  static calculateReadTime(content) {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }
}
