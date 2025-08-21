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
import { AiOutlineEye } from "react-icons/ai"

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState({ average: 0, count: 0 })
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showMoreSpecs, setShowMoreSpecs] = useState(false)
  const { addToCart } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/detail/${params.id}`)
        const data = await res.json()
        if (data.success) {
          setProduct(data.product)
          if (data.product.options && data.product.options.length > 0) {
            setSelectedOption(data.product.options[0])
          }
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
      const cartItem = {
        ...product,
        selectedOption: selectedOption,
        finalPrice: selectedOption ? selectedOption.price : product.price,
        finalStock: selectedOption ? selectedOption.stock : product.stock
      }
      addToCart(cartItem, quantity)
      alert(`Added ${quantity} ${product.name}${selectedOption ? ` (${selectedOption.size} - ${selectedOption.color})` : ''} to cart`)
    }
  }

  const handleOptionSelect = (option) => {
    setSelectedOption(option)
    setQuantity(1)
    if (option.images && option.images.length > 0) {
      setSelectedImage(0)
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
        body: JSON.stringify({ userId: user._id, productId: product._id }),
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

  const currentImages = selectedOption && selectedOption.images && selectedOption.images.length > 0 
    ? selectedOption.images 
    : product?.images || []

  const currentPrice = selectedOption ? selectedOption.price : product?.price
  const currentMRP = selectedOption ? selectedOption.mrp : product?.mrp
  const currentStock = selectedOption ? selectedOption.stock : product?.stock

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
              The product you are looking for does not exist.
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
            <div className="relative">
              <div className="aspect-square relative mb-4 rounded-lg overflow-hidden">
                <Image
                  src={currentImages[selectedImage] || "/placeholder.svg?height=600&width=600&query=product detail"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />

                {/* Views overlay */}
                <div className="absolute bottom-2 left-2 bg-black/50 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm">
                  <AiOutlineEye className="text-lg" />
                  <span>{product.views || 0}</span>
                </div>
              </div>

              {currentImages && currentImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {currentImages.map((image, index) => (
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
               {/* Product Info */}
            <div>
              {/* 1. Product Title */}
              <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
                {product.name}
              </h1>

              {/* 2. Rating */}
              <div className="flex items-center gap-2 mb-6">
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
                <span className="text-sm font-medium" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
                  {rating.average.toFixed(1)} ({rating.count} review{rating.count !== 1 ? "s" : ""})
                </span>
              </div>

              {/* 3. Price with Discount % and MRP */}
              <div className="mb-6">
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-3xl font-bold" style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}>
                    ₹{currentPrice}
                  </span>
                  {currentMRP && currentMRP > currentPrice && (
                    <>
                      <span className="text-xl text-gray-500 line-through" style={{ fontFamily: "Montserrat, sans-serif" }}>
                        ₹{currentMRP}
                      </span>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full" style={{ fontFamily: "Montserrat, sans-serif" }}>
                        {Math.round(((currentMRP - currentPrice) / currentMRP) * 100)}% off
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  Inclusive of all taxes
                </p>
              </div>

              {/* 4. Stock and Availability */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
                  Availability
                </h3>
                <div className="space-y-2">
                  <p
                    className={`text-sm font-medium ${currentStock > 0 ? "text-green-600" : "text-red-600"}`}
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {currentStock > 0 ? `✓ In Stock (${currentStock} available)` : "✗ Out of Stock"}
                  </p>
                  <p className="text-sm" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
                    Category: {product.category}
                  </p>
                  <p className="text-sm" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
                    Views: {product.views || 0}
                  </p>
                </div>
              </div>

              {/* 5. Product Specifications */}
              {product.attributes && product.attributes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
                    Specifications
                  </h3>
                  <div className="bg-white border rounded-lg p-4">
                    <div className="grid grid-cols-1 gap-3">
                      {product.attributes.map((attr, index) => (
                        <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                          <span className="font-medium" style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}>
                            {attr.name}
                          </span>
                          <span style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
                            {attr.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 5b. More Specifications (collapsible) */}
              {product.attributes && product.attributes.length > 0 && (
                <div className="mb-6">
                  <button
                    onClick={() => setShowMoreSpecs(!showMoreSpecs)}
                    className="px-4 py-2 border-2 font-semibold rounded-lg hover:opacity-80 transition-opacity"
                    style={{ borderColor: "#8C6141", color: "#8C6141", fontFamily: "Montserrat, sans-serif" }}
                  >
                    {showMoreSpecs ? "Hide More Specifications" : "More Specifications"}
                  </button>
                  {showMoreSpecs && (
                    <div className="mt-4 bg-white border rounded-lg p-4">
                      <ul className="space-y-2">
                        {product.attributes.map((attr, index) => (
                          <li key={index} className="flex items-center justify-between">
                            <span className="text-sm font-medium" style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}>
                              {attr.name}
                            </span>
                            <span className="text-sm" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
                              {attr.type}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* 6. Product Options (Flipkart Style) */}
              {product.options && product.options.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
                    Available Options
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleOptionSelect(option)}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          selectedOption && selectedOption._id === option._id 
                            ? 'border-opacity-100 bg-blue-50' 
                            : 'border-opacity-30 hover:border-opacity-60 hover:bg-gray-50'
                        }`}
                        style={{ borderColor: "#5A0117" }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            {option.size && (
                              <span className="font-semibold" style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}>
                                Size: {option.size}
                              </span>
                            )}
                            {option.color && (
                              <span className={`${option.size ? 'block' : ''} font-semibold`} style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}>
                                Color: {option.color}
                              </span>
                            )}
                          </div>
                          <span className="text-lg font-bold" style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}>
                            ₹{option.price}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
                            Stock: {option.stock}
                          </span>
                          {option.images && option.images.length > 0 && (
                            <span style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
                              📷 {option.images.length} images
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 7. Product Description with Read More */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
                  Description
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p
                    className="text-base leading-relaxed"
                    style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}
                  >
                    {product.description && product.description.length > 200 && !showFullDescription
                      ? `${product.description.substring(0, 200)}...`
                      : product.description}
                  </p>
                  {product.description && product.description.length > 200 && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="mt-2 text-sm font-medium hover:underline"
                      style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
                    >
                      {showFullDescription ? "Read Less" : "Read More"}
                    </button>
                  )}
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              {currentStock > 0 && (
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
                      onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
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
                  disabled={currentStock === 0}
                  className="flex-1 py-4 px-6 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#5A0117", fontFamily: "Montserrat, sans-serif" }}
                >
                  {currentStock > 0 ? "Add to Cart" : "Out of Stock"}
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
              <ReviewForm productId={product._id} onReviewAdded={handleReviewAdded} />
            </div>
          
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
