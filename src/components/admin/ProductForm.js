"use client"
import { useState, useEffect } from "react"
import ImageUpload from "../ImageUpload"

export default function ProductForm({ product, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    category: product?.category || "",
    stock: product?.stock || "",
    featured: product?.featured || false,
    images: product?.images || [],
  })
  const [categoriesHierarchy, setCategoriesHierarchy] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories?withHierarchy=true")
        const data = await res.json()
        if (data.success) {
          setCategoriesHierarchy(data.categories)
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchCategories()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        stock: Number.parseInt(formData.stock),
      }
      await onSubmit(submitData)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (images) => {
    setFormData({ ...formData, images })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
        {product ? "Edit Product" : "Add New Product"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
            >
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
              style={{ fontFamily: "Montserrat, sans-serif", focusRingColor: "#5A0117" }}
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
            >
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
              style={{ fontFamily: "Montserrat, sans-serif", focusRingColor: "#5A0117" }}
            >
              <option value="">Select a category</option>
              {categoriesHierarchy.map((category) => (
                <optgroup key={category._id} label={`📁 ${category.name}`}>
                  <option value={category.name}>{category.name} (Main Category)</option>
                  {category.subcategories &&
                    category.subcategories.map((subcategory) => (
                      <option key={subcategory._id} value={subcategory.name}>
                        └─ {subcategory.name}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
            <p className="text-xs mt-1" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
              Choose a main category or subcategory for your product
            </p>
          </div>

          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
            >
              Price (₹) *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
              style={{ fontFamily: "Montserrat, sans-serif", focusRingColor: "#5A0117" }}
              placeholder="0.00"
            />
          </div>

          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
            >
              Stock Quantity *
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
              style={{ fontFamily: "Montserrat, sans-serif", focusRingColor: "#5A0117" }}
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
          >
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
            style={{ fontFamily: "Montserrat, sans-serif", focusRingColor: "#5A0117" }}
            placeholder="Enter product description"
          />
        </div>

        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
          >
            Product Images
          </label>
          <ImageUpload currentImages={formData.images} onUpload={handleImageUpload} maxImages={5} />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm font-semibold" style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}>
              Featured Product
            </span>
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: "#5A0117", fontFamily: "Montserrat, sans-serif" }}
          >
            {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border-2 font-semibold rounded-lg hover:opacity-80 transition-opacity"
            style={{
              borderColor: "#AFABAA",
              color: "#AFABAA",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
