import crypto from "crypto"
import connectDB from "../../../../lib/mongodb"
import Order from "../../../../lib/models/Order"

export async function POST(request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await request.json()

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex")

    const isAuthentic = expectedSignature === razorpay_signature

    if (isAuthentic) {
      await connectDB()
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        status: "confirmed",
      })

      return Response.json({
        success: true,
        message: "Payment verified successfully",
      })
    } else {
      return Response.json({ success: false, error: "Payment verification failed" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return Response.json({ success: false, error: "Payment verification failed" }, { status: 500 })
  }
}
