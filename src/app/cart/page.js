"use client"
import { useRouter } from "next/navigation"
import Header from "../../components/shared/Header"
import Footer from "../../components/shared/Footer"
import CartItem from "../../components/CartItem"
import CartSummary from "../../components/CartSummary"
import { useCart } from "../../contexts/CartContext"
import Link from "next/link"

export default function CartPage() {
  const { items, clearCart } = useCart()
  const router = useRouter()

  const handleCheckout = () => {
    router.push("/checkout")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
              Shopping Cart
            </h1>
            <p className="mt-2" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
              Review your items before checkout
            </p>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-8">
                <svg className="mx-auto h-24 w-24 opacity-50" fill="none" stroke="#8C6141" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
                Your cart is empty
              </h2>
              <p className="text-lg mb-8" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link
                href="/products"
                className="inline-block px-8 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#5A0117", fontFamily: "Montserrat, sans-serif" }}
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
                      Cart Items ({items.length})
                    </h2>
                    <button
                      onClick={clearCart}
                      className="text-sm text-red-600 hover:text-red-800 transition-colors"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Clear Cart
                    </button>
                  </div>

                  <div className="space-y-4">
                    {items.map((item) => (
                      <CartItem key={item._id} item={item} />
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <Link
                      href="/products"
                      className="inline-block px-6 py-2 border-2 font-semibold rounded-lg hover:opacity-80 transition-opacity"
                      style={{
                        borderColor: "#8C6141",
                        color: "#8C6141",
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>

              {/* Cart Summary */}
              <div className="lg:col-span-1">
                <CartSummary onCheckout={handleCheckout} />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
