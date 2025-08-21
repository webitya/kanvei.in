"use client"
import { useState, useEffect } from "react"
import AdminLayout from "../../../components/shared/AdminLayout"
import ProductForm from "../../../components/admin/ProductForm"

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products")
      const data = await res.json()
      if (data.success) {
        setProducts(data.products)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData) => {
    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : "/api/products"
      const method = editingProduct ? "PUT" : "POST"
      const token = typeof window !== 'undefined' ? localStorage.getItem('kanvei-token') : null

      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (data.success) {
        await fetchProducts()
        setShowForm(false)
        setEditingProduct(null)
        alert(editingProduct ? "Product updated successfully!" : "Product created successfully!")
      } else {
        alert("Error: " + data.error)
      }
    } catch (error) {
      console.error("Error submitting product:", error)
      alert("Error submitting product")
    }
  }

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('kanvei-token') : null
      
      const res = await fetch(`/api/products/${productId}`, { 
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      })
      const data = await res.json()
      if (data.success) {
        await fetchProducts()
        alert("Product deleted successfully!")
      } else {
        alert("Error: " + data.error)
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Error deleting product")
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
              Products
            </h1>
            <p className="mt-2" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
              Manage your product inventory
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full sm:w-auto px-6 py-2 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#5A0117", fontFamily: "Montserrat, sans-serif" }}
            >
              Add Product
            </button>
          )}
        </div>

        {/* Form */}
        {showForm && <ProductForm product={editingProduct} onSubmit={handleSubmit} onCancel={handleCancel} />}

        {/* Products List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
              All Products ({products.length})
            </h2>
          </div>
          <div className="p-4 sm:p-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded h-24 animate-pulse"></div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 p-3 sm:p-4 border rounded-lg">
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                      {product.images?.[0] && (
                        <img
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          className="w-14 h-14 sm:w-20 sm:h-20 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3
                            className="text-lg font-semibold"
                            style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}
                          >
                            {product.name}
                          </h3>
                          {product.featured && (
                            <span
                              className="px-2 py-1 text-xs font-semibold text-white rounded"
                              style={{ backgroundColor: "#8C6141" }}
                            >
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-sm mb-1 break-words" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
                          {product.description?.substring(0, 100)}...
                        </p>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm">
                          <span
                            className="font-semibold"
                            style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
                          >
                            ₹{product.price}
                          </span>
                          <span style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
                            Category: {product.category}
                          </span>
                          <span
                            className={product.stock > 0 ? "text-green-600" : "text-red-600"}
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                          >
                            Stock: {product.stock}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 sm:gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border-2 font-semibold rounded-md hover:opacity-80 transition-opacity"
                        style={{
                          borderColor: "#8C6141",
                          color: "#8C6141",
                          fontFamily: "Montserrat, sans-serif",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
                No products found. Create your first product!
              </p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
