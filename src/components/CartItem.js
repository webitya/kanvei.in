"use client"

import Image from "next/image"
import { useCart } from "../contexts/CartContext"

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart()

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg">
      <div className="w-20 h-20 relative rounded-lg overflow-hidden">
        <Image
          src={item.image || "/placeholder.svg?height=80&width=80&query=cart item"}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-semibold" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
          {item.name}
        </h3>
        <p className="text-lg font-bold" style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}>
          ₹{item.price}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => updateQuantity(item._id, item.quantity - 1)}
          className="w-8 h-8 rounded-full border-2 flex items-center justify-center hover:opacity-80 transition-opacity"
          style={{ borderColor: "#5A0117", color: "#5A0117" }}
        >
          -
        </button>
        <span
          className="text-lg font-semibold w-8 text-center"
          style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
        >
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(item._id, Math.min(item.stock, item.quantity + 1))}
          disabled={item.quantity >= item.stock}
          className="w-8 h-8 rounded-full border-2 flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-50"
          style={{ borderColor: "#5A0117", color: "#5A0117" }}
        >
          +
        </button>
      </div>

      <div className="text-right">
        <p className="text-lg font-bold" style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}>
          ₹{item.price * item.quantity}
        </p>
        <button
          onClick={() => removeFromCart(item._id)}
          className="text-sm text-red-600 hover:text-red-800 transition-colors"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Remove
        </button>
      </div>
    </div>
  )
}
