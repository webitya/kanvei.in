"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Script from "next/script"
import Header from "../../components/shared/Header"
import Footer from "../../components/shared/Footer"
import CartSummary from "../../components/CartSummary"
import RazorpayButton from "../../components/RazorpayButton"
import { useCart } from "../../contexts/CartContext"

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const [formData, setFormData] = useState({
    // Shipping Information
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    // Payment Information
    paymentMethod: "cod",
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const calculateTotal = () => {
    const subtotal = getCartTotal()
    const shipping = subtotal > 500 ? 0 : 50
    const tax = subtotal * 0.18
    return subtotal + shipping + tax
  }

  const handleCODOrder = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: calculateTotal(),
        customerEmail: formData.email,
        shippingAddress: {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          phone: formData.phone,
        },
        paymentMethod: "cod",
        paymentStatus: "pending",
        status: "confirmed",
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      const data = await response.json()

      if (data.success) {
        clearCart()
        alert("Order placed successfully! You will pay on delivery.")
        router.push(`/order-confirmation?orderId=${data.orderId}`)
      } else {
        alert("Error placing order: " + data.error)
      }
    } catch (error) {
      console.error("Error placing order:", error)
      alert("Error placing order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleRazorpaySuccess = (orderId) => {
    clearCart()
    alert("Payment successful! Your order has been confirmed.")
    router.push(`/order-confirmation?orderId=${orderId}`)
  }

  const handleRazorpayError = (error) => {
    alert("Payment failed: " + error)
  }

  const getOrderData = () => ({
    items: items.map((item) => ({
      productId: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
    totalAmount: calculateTotal(),
    customerEmail: formData.email,
    shippingAddress: {
      name: formData.name,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      phone: formData.phone,
    },
  })

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
              Your cart is empty
            </h1>
            <p className="mb-6" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
              Add some items to your cart before checkout.
            </p>
            <button
              onClick={() => router.push("/products")}
              className="px-6 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#5A0117", fontFamily: "Montserrat, sans-serif" }}
            >
              Continue Shopping
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" onLoad={() => setRazorpayLoaded(true)} />

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
                Checkout
              </h1>
              <p className="mt-2" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
                Complete your order
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleCODOrder} className="space-y-8">
                  {/* Shipping Information */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
                      Shipping Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          className="block text-sm font-semibold mb-2"
                          style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
                        >
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                          style={{ fontFamily: "Montserrat, sans-serif", focusRingColor: "#5A0117" }}
                        />
                      </div>

                      <div>
                        <label
                          className="block text-sm font-semibold mb-2"
                          style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
                        >
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                          style={{ fontFamily: "Montserrat, sans-serif", focusRingColor: "#5A0117" }}
                        />
                      </div>

                      <div>
                        <label
                          className="block text-sm font-semibold mb-2"
                          style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
                        >
                          Phone *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                          style={{ fontFamily: "Montserrat, sans-serif", focusRingColor: "#5A0117" }}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label
                          className="block text-sm font-semibold mb-2"
                          style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
                        >
                          Address *
                        </label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                          style={{ fontFamily: "Montserrat, sans-serif", focusRingColor: "#5A0117" }}
                        />
                      </div>

                      <div>
                        <label
                          className="block text-sm font-semibold mb-2"
                          style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
                        >
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                          style={{ fontFamily: "Montserrat, sans-serif", focusRingColor: "#5A0117" }}
                        />
                      </div>

                      <div>
                        <label
                          className="block text-sm font-semibold mb-2"
                          style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
                        >
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                          style={{ fontFamily: "Montserrat, sans-serif", focusRingColor: "#5A0117" }}
                        />
                      </div>

                      <div>
                        <label
                          className="block text-sm font-semibold mb-2"
                          style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
                        >
                          PIN Code *
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                          style={{ fontFamily: "Montserrat, sans-serif", focusRingColor: "#5A0117" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
                      Payment Method
                    </h2>

                    <div className="space-y-4">
                      <label className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={formData.paymentMethod === "cod"}
                          onChange={handleInputChange}
                          className="text-red-600"
                        />
                        <div>
                          <span style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}>
                            Cash on Delivery (COD)
                          </span>
                          <p className="text-sm" style={{ color: "#8C6141" }}>
                            Pay when your order is delivered
                          </p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="razorpay"
                          checked={formData.paymentMethod === "razorpay"}
                          onChange={handleInputChange}
                          className="text-red-600"
                        />
                        <div>
                          <span style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}>
                            Pay Online (Razorpay)
                          </span>
                          <p className="text-sm" style={{ color: "#8C6141" }}>
                            Credit/Debit Card, UPI, Net Banking, Wallets
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Payment Buttons */}
                  <div className="space-y-4">
                    {formData.paymentMethod === "cod" ? (
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                        style={{ backgroundColor: "#5A0117", fontFamily: "Montserrat, sans-serif" }}
                      >
                        {loading ? "Placing Order..." : "Place Order (COD)"}
                      </button>
                    ) : (
                      razorpayLoaded && (
                        <RazorpayButton
                          amount={calculateTotal()}
                          orderData={getOrderData()}
                          onSuccess={handleRazorpaySuccess}
                          onError={handleRazorpayError}
                        />
                      )
                    )}
                  </div>
                </form>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <CartSummary showCheckoutButton={false} />
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}
