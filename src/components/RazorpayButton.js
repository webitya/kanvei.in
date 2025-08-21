"use client"
import { useState } from "react"

export default function RazorpayButton({ amount, orderData, onSuccess, onError }) {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)

    try {
      // Create Razorpay order
      const orderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      })

      const orderResult = await orderResponse.json()

      if (!orderResult.success) {
        throw new Error("Failed to create payment order")
      }

      // Create order in database first
      const dbOrderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...orderData,
          paymentMethod: "razorpay",
          paymentStatus: "pending",
          razorpayOrderId: orderResult.orderId,
        }),
      })

      const dbOrderResult = await dbOrderResponse.json()

      if (!dbOrderResult.success) {
        throw new Error("Failed to create order")
      }

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderResult.amount,
        currency: orderResult.currency,
        name: "KANVEI",
        description: "Purchase from KANVEI",
        order_id: orderResult.orderId,
        handler: async (response) => {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: dbOrderResult.orderId,
              }),
            })

            const verifyResult = await verifyResponse.json()

            if (verifyResult.success) {
              onSuccess(dbOrderResult.orderId)
            } else {
              onError("Payment verification failed")
            }
          } catch (error) {
            onError("Payment verification failed")
          }
        },
        prefill: {
          name: orderData.shippingAddress.name,
          email: orderData.customerEmail || "",
          contact: orderData.shippingAddress.phone,
        },
        theme: {
          color: "#5A0117",
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error("Payment error:", error)
      onError(error.message)
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full py-4 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
      style={{ backgroundColor: "#5A0117", fontFamily: "Montserrat, sans-serif" }}
    >
      {loading ? "Processing..." : `Pay ₹${amount} with Razorpay`}
    </button>
  )
}
