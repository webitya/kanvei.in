"use client"
import { useState, useEffect } from "react"

export default function CategoryForm({ category, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
    image: category?.image || "",
    parentCategory: category?.parentCategory || "",
  })
  const [loading, setLoading] = useState(false)
  const [mainCategories, setMainCategories] = useState([])

  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const res = await fetch("/api/categories?mainOnly=true")
        const data = await res.json()
        if (data.success) {
          setMainCategories(data.categories)
        }
      } catch (error) {
        console.error("Error fetching main categories:", error)
      }
    }

    fetchMainCategories()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData = {
        ...formData,
        parentCategory: formData.parentCategory || null,
      }
      await onSubmit(submitData)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
        {category ? "Edit Category" : "Add New Category"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
            >
              Category Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
              style={{ fontFamily: "Montserrat, sans-serif", focusRingColor: "#5A0117" }}
              placeholder="Enter category name"
            />
          </div>

          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
            >
              Parent Category
            </label>
            <select
              value={formData.parentCategory}
              onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
              style={{ fontFamily: "Montserrat, sans-serif", focusRingColor: "#5A0117" }}
            >
              <option value="">Main Category (No Parent)</option>
              {mainCategories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <p className="text-xs mt-1" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
              Leave empty to create a main category, or select a parent to create a subcategory
            </p>
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
            placeholder="Enter category description"
          />
        </div>

        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
          >
            Image URL
          </label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
            style={{ fontFamily: "Montserrat, sans-serif", focusRingColor: "#5A0117" }}
            placeholder="Enter image URL"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: "#5A0117", fontFamily: "Montserrat, sans-serif" }}
          >
            {loading ? "Saving..." : category ? "Update Category" : "Create Category"}
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
