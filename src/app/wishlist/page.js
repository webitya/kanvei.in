"use client"
import { useState, useEffect } from "react"
import Header from "../../components/shared/Header"
import Footer from "../../components/shared/Footer"
import ProductCard from "../../components/ProductCard"
import { useAuth } from "../../contexts/AuthContext"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  // If admin is logged in, redirect to admin dashboard (no wishlist for admin)
  if (user?.role === "admin") {
    if (typeof window !== "undefined") {
      router.replace("/admindashboard")
    }
    return null
  }

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`/api/wishlist?userId=${user._id}`)
        const data = await res.json()
        if (data.success) {
          setWishlist(data.wishlist)
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
              Please Login
            </h1>
            <p style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
              You need to be logged in to view your wishlist.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 text-white" style={{ backgroundColor: "#5A0117" }}>
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "Sugar, serif" }}>
              My Wishlist
            </h1>
            <p className="text-xl opacity-90" style={{ fontFamily: "Montserrat, sans-serif", color: "#DBCCB7" }}>
              Your favorite products saved for later
            </p>
          </div>
        </section>

        {/* Wishlist Items */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
                ))}
              </div>
            ) : wishlist.length > 0 ? (
              <>
                <div className="mb-6">
                  <p className="text-lg" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
                    {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} in your wishlist
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {wishlist.map((item) => (
                    <ProductCard key={item._id} product={item.product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
                  Your wishlist is empty
                </h3>
                <p className="text-lg mb-6" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
                  Start adding products you love to your wishlist
                </p>
           <Link
  href="/products"
  className="inline-block px-6 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
  style={{ backgroundColor: "#5A0117", fontFamily: "Montserrat, sans-serif" }}
>
  Browse Products
</Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
