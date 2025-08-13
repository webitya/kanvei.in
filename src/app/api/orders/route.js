import clientPromise from "../../../lib/mongodb"
import { Order } from "../../../lib/models/Order"
import { sendOrderConfirmationEmail } from "../../../lib/email"

export async function GET(request) {
  try {
    const client = await clientPromise
    const db = client.db("kanvei")

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const status = searchParams.get("status")

    const filter = {}
    if (userId) filter.userId = userId
    if (status) filter.status = status

    const orders = await Order.findAll(db, filter)

    return Response.json({ success: true, orders })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise
    const db = client.db("kanvei")

    const orderData = await request.json()
    const order = await Order.create(db, orderData)

    // Send order confirmation email
    if (orderData.shippingAddress?.email || orderData.email) {
      const customerEmail = orderData.shippingAddress?.email || orderData.email
      try {
        await sendOrderConfirmationEmail(order, customerEmail)
      } catch (emailError) {
        console.error("Failed to send order confirmation email:", emailError)
        // Don't fail the order creation if email fails
      }
    }

    return Response.json({ success: true, order })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
