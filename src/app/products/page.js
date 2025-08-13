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
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [sortBy, setSortBy] = useState("name")
  const [showFilters, setShowFilters] = useState(false)
  const [inStock, setInStock] = useState(false)

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

    const matchesPrice =
      (!priceRange.min || product.price >= Number.parseInt(priceRange.min)) &&
      (!priceRange.max || product.price <= Number.parseInt(priceRange.max))

    const matchesStock = !inStock || product.stock > 0

    return matchesCategory && matchesSearch && matchesPrice && matchesStock
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "name":
        return a.name.localeCompare(b.name)
      case "newest":
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 text-white" style={{ backgroundColor: "#5A0117" }}>
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "Sugar, serif" }}>
              Shop All Products
            </h1>
            <p className="text-xl opacity-90" style={{ fontFamily: "Montserrat, sans-serif", color: "#DBCCB7" }}>
              Discover our complete collection with advanced filtering options
            </p>
          </div>
        </section>

        <section className="py-6 px-4 sm:px-6 lg:px-8 border-b" style={{ backgroundColor: "#DBCCB7" }}>
          <div className="max-w-7xl mx-auto">
            {/* Mobile Filter Toggle */}
            <div className="md:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full px-4 py-2 text-white rounded-lg font-semibold"
                style={{ backgroundColor: "#5A0117", fontFamily: "Montserrat, sans-serif" }}
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div>

            {/* Filters Container */}
            <div className={`${showFilters ? "block" : "hidden"} md:block space-y-4`}>
              {/* Search Bar */}
              <div className="w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-lg"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    focusRingColor: "#5A0117",
                  }}
                />
              </div>

              {/* Filter Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Category Filter */}
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
                  >
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ fontFamily: "Montserrat, sans-serif", focusRingColor: "#5A0117" }}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
                  >
                    Min Price
                  </label>
                  <input
                    type="number"
                    placeholder="₹0"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ fontFamily: "Montserrat, sans-serif", focusRingColor: "#5A0117" }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
                  >
                    Max Price
                  </label>
                  <input
                    type="number"
                    placeholder="₹10000"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ fontFamily: "Montserrat, sans-serif", focusRingColor: "#5A0117" }}
                  />
                </div>

                {/* Sort By */}
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
                  >
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ fontFamily: "Montserrat, sans-serif", focusRingColor: "#5A0117" }}
                  >
                    <option value="name">Name A-Z</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>

                {/* Stock Filter */}
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
                  >
                    Availability
                  </label>
                  <div className="flex items-center h-10">
                    <input
                      type="checkbox"
                      id="inStock"
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                      className="mr-2 h-4 w-4 rounded focus:ring-2 focus:ring-opacity-50"
                      style={{ accentColor: "#5A0117" }}
                    />
                    <label
                      htmlFor="inStock"
                      className="text-sm"
                      style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
                    >
                      In Stock Only
                    </label>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setSelectedCategory("")
                    setSearchTerm("")
                    setPriceRange({ min: "", max: "" })
                    setSortBy("name")
                    setInStock(false)
                  }}
                  className="px-4 py-2 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#8C6141", fontFamily: "Montserrat, sans-serif" }}
                >
                  Clear All Filters
                </button>
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
            ) : sortedProducts.length > 0 ? (
              <>
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <p
                      className="text-lg font-semibold"
                      style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
                    >
                      Showing {sortedProducts.length} of {products.length} products
                    </p>
                    {(selectedCategory || searchTerm || priceRange.min || priceRange.max || inStock) && (
                      <p className="text-sm mt-1" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
                        Filters applied
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <h3 className="text-3xl font-bold mb-4" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
                    No products found
                  </h3>
                  <p className="text-lg mb-6" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
                    Try adjusting your search or filter criteria to find what you are looking for
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory("")
                      setSearchTerm("")
                      setPriceRange({ min: "", max: "" })
                      setSortBy("name")
                      setInStock(false)
                    }}
                    className="px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: "#5A0117", fontFamily: "Montserrat, sans-serif" }}
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
