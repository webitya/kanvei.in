export class Order {
  constructor(data) {
    this.userId = data.userId
    this.items = data.items
    this.totalAmount = data.totalAmount
    this.status = data.status || "pending"
    this.shippingAddress = data.shippingAddress
    this.paymentMethod = data.paymentMethod
    this.paymentStatus = data.paymentStatus || "pending"
    this.razorpayPaymentId = data.razorpayPaymentId || null
    this.razorpayOrderId = data.razorpayOrderId || null
    this.customerEmail = data.customerEmail || null
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
  }

  static async create(db, orderData) {
    const order = new Order(orderData)
    const result = await db.collection("orders").insertOne(order)
    return { ...order, _id: result.insertedId }
  }

  static async findAll(db, filter = {}) {
    return await db.collection("orders").find(filter).toArray()
  }

  static async findById(db, id) {
    const { ObjectId } = require("mongodb")
    return await db.collection("orders").findOne({ _id: new ObjectId(id) })
  }

  static async updateById(db, id, updateData) {
    const { ObjectId } = require("mongodb")
    updateData.updatedAt = new Date()
    return await db.collection("orders").updateOne({ _id: new ObjectId(id) }, { $set: updateData })
  }

  static async findByRazorpayOrderId(db, razorpayOrderId) {
    return await db.collection("orders").findOne({ razorpayOrderId })
  }
}
