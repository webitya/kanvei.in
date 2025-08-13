"use client"
import { useState, useEffect } from "react"
import Header from "../components/shared/Header"
import Footer from "../components/shared/Footer"
import ProductCard from "../components/ProductCard"
import CategoryCard from "../components/CategoryCard"
import Link from "next/link"

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured products
        const productsRes = await fetch("/api/products?featured=true")
        const productsData = await productsRes.json()
        if (productsData.success) {
          setFeaturedProducts(productsData.products.slice(0, 8))
        }

        // Fetch categories
        const categoriesRes = await fetch("/api/categories")
        const categoriesData = await categoriesRes.json()
        if (categoriesData.success) {
          setCategories(categoriesData.categories.slice(0, 6))
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section
          className="relative h-screen flex items-center justify-center text-white"
          style={{ backgroundColor: "#5A0117" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ fontFamily: "Sugar, serif" }}>
              Kanvei
            </h1>
            <p
              className="text-xl md:text-2xl mb-8 opacity-90"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#DBCCB7" }}
            >
              Discover Premium Quality Products with Exceptional Craftsmanship
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-4 text-lg font-semibold rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#8C6141", fontFamily: "Montserrat, sans-serif" }}
            >
              Shop Now
            </Link>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
              Featured Products
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
              Handpicked selection of our finest products, crafted with attention to detail and quality
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-block px-6 py-3 border-2 font-semibold rounded-lg hover:opacity-80 transition-opacity"
              style={{
                borderColor: "#5A0117",
                color: "#5A0117",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              View All Products
            </Link>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#DBCCB7" }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
                Shop by Category
              </h2>
              <p
                className="text-lg max-w-2xl mx-auto"
                style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}
              >
                Explore our carefully curated categories to find exactly what you are looking for
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <CategoryCard key={category._id} category={category} />
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Link
                href="/categories"
                className="inline-block px-6 py-3 border-2 font-semibold rounded-lg hover:opacity-80 transition-opacity"
                style={{
                  borderColor: "#5A0117",
                  color: "#5A0117",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                View All Categories
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
                About Kanvei
              </h2>
              <p className="text-lg mb-6" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
                At Kanvei, we believe in the power of exceptional craftsmanship and timeless design. Our carefully
                curated collection represents the finest in quality and style, bringing you products that stand the test
                of time.
              </p>
              <p className="text-lg mb-8" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
                Every item in our collection is selected with meticulous attention to detail, ensuring that you receive
                only the best. Experience the difference that quality makes.
              </p>
              <Link
                href="/about"
                className="inline-block px-6 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#5A0117", fontFamily: "Montserrat, sans-serif" }}
              >
                Learn More
              </Link>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden">
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="About Kanvei"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
