"use client"
import { useState, useEffect } from "react"
import Header from "../components/shared/Header"
import Footer from "../components/shared/Footer"
import ProductCard from "../components/ProductCard"
import CategoryCard from "../components/CategoryCard"
import HeroCarousel from "../components/HeroCarousel"
import Link from "next/link"  ;
import bcrypt from "bcryptjs";


export default function HomePage() {  

  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)  

  console.log("kaya baat hai guys") 

  useEffect(()=>{

    let koiFunction = async()=>{ 

   const password = "1234"; // Example password

  
const hashedPassword = await bcrypt.hash(password, 10);

console.log("Hashed Password:", hashedPassword);
    }

    koiFunction();

  }, [])


  

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured products
        const productsRes = await fetch("/api/products?featured=true")
        const productsData = await productsRes.json()
        if (productsData.success) {
          setFeaturedProducts(productsData.products.slice(0, 4))
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
        {/* Hero Carousel Section */}
        <section className="relative">
          <HeroCarousel />
        </section>

        {/* Categories and Featured Offers Section */}
        <section className="flex flex-col sm:flex-row">
          {/* Categories - Left Half */}
          <div className="w-full sm:w-1/2 px-4 py-4 sm:py-6" style={{ backgroundColor: "#DBCCB7" }}>
            <h3
              className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center"
              style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}
            >
              Categories
            </h3>
            {loading ? (
              <div className="grid grid-cols-2 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded h-12 sm:h-16 animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {categories.slice(0, 4).map((category) => (
                  <Link
                    key={category._id}
                    href={`/${category.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                    className="p-2 rounded-lg text-center text-xs sm:text-sm font-medium hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: "#5A0117", color: "white", fontFamily: "Montserrat, sans-serif" }}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
            <div className="text-center mt-3 sm:mt-4">
              <Link
                href="/categories"
                className="text-xs sm:text-sm font-medium hover:underline"
                style={{ color: "#5A0117", fontFamily: "Montserrat, sans-serif" }}
              >
                View All →
              </Link>
            </div>
          </div>

          {/* Featured Offers - Right Half */}
          <div className="w-full sm:w-1/2 px-4 py-4 sm:py-6" style={{ backgroundColor: "#8C6141" }}>
            <h3
              className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center text-white"
              style={{ fontFamily: "Sugar, serif" }}
            >
              Featured Offers
            </h3>
            {loading ? (
              <div className="grid grid-cols-2 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded h-12 sm:h-16 animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {featuredProducts.map((product) => (
                  <Link
                    key={product._id}
                    href={`/products/${product._id}`}
                    className="bg-white p-2 rounded-lg text-center hover:opacity-90 transition-opacity"
                  >
                    <div
                      className="text-xs font-medium truncate"
                      style={{ color: "#5A0117", fontFamily: "Montserrat, sans-serif" }}
                    >
                      {product.name}
                    </div>
                    <div className="text-xs font-bold" style={{ color: "#8C6141" }}>
                      ${product.price}
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <div className="text-center mt-3 sm:mt-4">
              <Link
                href="/products"
                className="text-xs sm:text-sm font-medium text-white hover:underline"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Shop All →
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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
        <section className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#DBCCB7" }}>
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
        <section className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
                About Kanvei
              </h2>
              <p className="text-lg mb-6" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
                At Kanvei, we curate an exceptional collection spanning Stationery, Jewellery, Fashion, Cosmetics, and
                Electronics. Our carefully selected products represent the finest in quality, style, and craftsmanship
                across diverse categories.
              </p>
              <p className="text-lg mb-8" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
                From premium writing instruments to elegant jewelry, from sophisticated fashion to cutting-edge
                electronics, every item in our collection is chosen with meticulous attention to detail and quality.
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
                alt="KANVEI Product Collection"
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
