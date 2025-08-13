"use client"

import { useCart } from "../contexts/CartContext"

export default function CartSummary({ showCheckoutButton = true, onCheckout }) {
  const { items, getCartTotal } = useCart()

  const subtotal = getCartTotal()
  const shipping = subtotal > 500 ? 0 : 50
  const tax = subtotal * 0.18 // 18% GST
  const total = subtotal + shipping + tax

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
        Order Summary
      </h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
          <span>Subtotal ({items.length} items)</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
          <span>Tax (GST 18%)</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
        <div className="border-t pt-3">
          <div
            className="flex justify-between text-xl font-bold"
            style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}
          >
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {subtotal < 500 && (
        <p className="text-sm mb-4" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
          Add ₹{(500 - subtotal).toFixed(2)} more for free shipping!
        </p>
      )}

      {showCheckoutButton && (
        <button
          onClick={onCheckout}
          disabled={items.length === 0}
          className="w-full py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "#5A0117", fontFamily: "Montserrat, sans-serif" }}
        >
          Proceed to Checkout
        </button>
      )}
    </div>
  )
}
