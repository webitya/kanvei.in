"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Header from "../../../components/shared/Header"
import Footer from "../../../components/shared/Footer"
import Image from "next/image"
import { useCart } from "../../../contexts/CartContext"
import { useAuth } from "../../../contexts/AuthContext"
import ReviewForm from "../../../components/ReviewForm"
import ReviewsList from "../../../components/ReviewsList"

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState({ average: 0, count: 0 })
  const [isInWishlist, setIsInWishlist] = useState(false)
  const { addToCart } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`)
        const data = await res.json()
        if (data.success) {
          setProduct(data.product)
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews/${params.id}`)
        const data = await res.json()
        if (data.success) {
          setReviews(data.reviews)
          setRating(data.rating)
        }
      } catch (error) {
        console.error("Error fetching reviews:", error)
      }
    }

    if (params.id) {
      fetchProduct()
      fetchReviews()
    }
  }, [params.id])

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity)
      alert(`Added ${quantity} ${product.name} to cart`)
    }
  }

  const handleWishlistToggle = async () => {
    if (!user) {
      alert("Please login to add items to wishlist")
      return
    }

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, productId: params.id }),
      })

      const data = await res.json()
      if (data.success) {
        setIsInWishlist(data.action === "added")
        alert(data.action === "added" ? "Added to wishlist" : "Removed from wishlist")
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error)
    }
  }

  const handleReviewAdded = () => {
    // Refresh reviews
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews/${params.id}`)
        const data = await res.json()
        if (data.success) {
          setReviews(data.reviews)
          setRating(data.rating)
        }
      } catch (error) {
        console.error("Error fetching reviews:", error)
      }
    }
    fetchReviews()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{ borderColor: "#5A0117" }}></div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
              Product not found
            </h1>
            <p style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
              The product you're looking for doesn't exist.
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

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Product Images */}
            <div>
              <div className="aspect-square relative mb-4 rounded-lg overflow-hidden">
                <Image
                  src={product.images?.[selectedImage] || "/placeholder.svg?height=600&width=600&query=product detail"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square relative rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? "border-opacity-100" : "border-opacity-30"
                      }`}
                      style={{ borderColor: "#5A0117" }}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
                {product.name}
              </h1>

              {rating.count > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-lg ${star <= Math.round(rating.average) ? "text-yellow-400" : "text-gray-300"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
                    ({rating.count} review{rating.count !== 1 ? "s" : ""})
                  </span>
                </div>
              )}

              <p className="text-3xl font-bold mb-6" style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}>
                ₹{product.price}
              </p>

              <p
                className="text-lg mb-8 leading-relaxed"
                style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}
              >
                {product.description}
              </p>

              <div className="mb-6">
                <p className="text-sm mb-2" style={{ fontFamily: "Montserrat, sans-serif", color: "#AFABAA" }}>
                  Category: {product.category}
                </p>
                <p
                  className={`text-sm ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </p>
              </div>

              {product.stock > 0 && (
                <div className="mb-8">
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
                  >
                    Quantity:
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border-2 flex items-center justify-center hover:opacity-80 transition-opacity"
                      style={{ borderColor: "#5A0117", color: "#5A0117" }}
                    >
                      -
                    </button>
                    <span
                      className="text-xl font-semibold"
                      style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
                    >
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-10 h-10 rounded-lg border-2 flex items-center justify-center hover:opacity-80 transition-opacity"
                      style={{ borderColor: "#5A0117", color: "#5A0117" }}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 py-4 px-6 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#5A0117", fontFamily: "Montserrat, sans-serif" }}
                >
                  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className={`px-6 py-4 border-2 font-semibold rounded-lg hover:opacity-80 transition-opacity ${
                    isInWishlist ? "text-red-500 border-red-500" : ""
                  }`}
                  style={{
                    borderColor: isInWishlist ? "#ef4444" : "#8C6141",
                    color: isInWishlist ? "#ef4444" : "#8C6141",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  {isInWishlist ? "♥" : "♡"}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
                Customer Reviews
              </h2>
              <ReviewsList reviews={reviews} rating={rating} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
                Write a Review
              </h2>
              <ReviewForm productId={params.id} onReviewAdded={handleReviewAdded} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
