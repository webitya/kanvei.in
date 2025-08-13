"use client"
import { useState, useEffect } from "react"
import Header from "../../components/shared/Header"
import Footer from "../../components/shared/Footer"
import ProductCard from "../../components/ProductCard"

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsRes = await fetch("/api/products")
        const productsData = await productsRes.json()
        if (productsData.success) {
          setProducts(productsData.products)
        }

        // Fetch categories
        const categoriesRes = await fetch("/api/categories")
        const categoriesData = await categoriesRes.json()
        if (categoriesData.success) {
          setCategories(categoriesData.categories)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    const matchesSearch =
      !searchTerm ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 text-white" style={{ backgroundColor: "#5A0117" }}>
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "Sugar, serif" }}>
              Our Products
            </h1>
            <p className="text-xl opacity-90" style={{ fontFamily: "Montserrat, sans-serif", color: "#DBCCB7" }}>
              Discover our complete collection of premium products
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 border-b" style={{ backgroundColor: "#DBCCB7" }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="w-full md:w-96">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    focusRingColor: "#5A0117",
                  }}
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-4">
                <label className="font-semibold" style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}>
                  Category:
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    focusRingColor: "#5A0117",
                  }}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div className="mb-6">
                  <p className="text-lg" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
                    Showing {filteredProducts.length} products
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
                  No products found
                </h3>
                <p className="text-lg" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
