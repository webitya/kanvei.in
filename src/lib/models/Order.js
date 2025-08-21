import mongoose from "mongoose"

const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number },
    options: { type: Object, default: {} },
  },
  { _id: false },
)

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: { type: [OrderItemSchema], default: [] },
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "pending" },
    shippingAddress: { type: Object },
    paymentMethod: { type: String },
    paymentStatus: { type: String, default: "pending" },
    razorpayPaymentId: { type: String, default: null },
    razorpayOrderId: { type: String, default: null, index: true },
    customerEmail: { type: String, default: null },
  },
  { timestamps: true },
)

if (mongoose.models.Order) {
  delete mongoose.models.Order
}

const Order = mongoose.model("Order", OrderSchema)

export default Order
